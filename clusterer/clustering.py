from flask import Flask, request, jsonify, Blueprint
from math import inf
from sklearn.cluster import KMeans
from sklearn import mixture
from sklearn.feature_extraction import DictVectorizer
import json
import pickle
import globals
clustering = Blueprint('clustering', __name__, template_folder='templates')
@clustering.route('/clustering/startClustering', methods=['POST'])
def cluster_data():
    global vec
    global kmeans
    global transformed
    globals.status=globals.Status.clustering_started
    vec = DictVectorizer()
    measurements=globals.trainingData
    transformed=vec.fit_transform(measurements).toarray()
    kmeans=  KMeans(n_clusters=int(request.get_json()['clustersNumber']))
    kmeans.fit(transformed)
    globals.status=globals.Status.data_clustered
    return jsonify({})
# res=kmeans.fit(transformed)

# print(vec.fit_transform(measurements).toarray())
# print(res)
# print(kmeans.labels_)
# print(kmeans.cluster_centers_)
# print(kmeans)
# a=pickle.dumps(kmeans)
# kmeans=pickle.loads(a)
# print('after(reload)')
# print(kmeans.labels_)
# print(kmeans.cluster_centers_)

# pickle.dump(kmeans, open( "save.p", "wb" ) )

# kmeans = pickle.load(open( "clusterer/save.p", "rb" ) )
# print(transformed)


def get_clusters():
    global vec
    global kmeans
    global transformed
    return {
        'dataLabels':vec.get_feature_names(),
        'data':transformed.tolist(),
        'clusters': kmeans.labels_.tolist(),
    }
def get_clustering():
    global vec
    global kmeans
    global transformed
    return {
        'data':transformed,
        'clustering': kmeans
    }
# print(measurements)
# print(kmeans.predict([1, 0, 0, -10000]))
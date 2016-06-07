from flask import Flask, request, jsonify, Blueprint
import json
import time
from datetime import datetime
import globals
from sklearn.metrics.pairwise import euclidean_distances
monitoring = Blueprint('monitoring', __name__, template_folder='templates')

@monitoring.route('/monitor/')
def check_request():
    if globals.status!=globals.Status.outliers_monitoring and globals.status!=globals.Status.assignment_monitoring:
        return jsonify({'message':'Status is not set to monitoring, current status is: '+ str(globals.status)})
    global lastRequestTimePerIp
    request_time=datetime.now()
    requestTimestamp=time.mktime(request_time.timetuple())
    lastRequestTimestamp = globals.lastRequestTimePerIp[request.headers.get('IP-Address')] if request.headers.get('IP-Address') in globals.lastRequestTimePerIp else None
    fromLastUserRequest= -10000000 if lastRequestTimestamp is None else (requestTimestamp-lastRequestTimestamp)
    globals.lastRequestTimePerIp[request.headers.get('IP-Address')]=requestTimestamp
    print(globals)
    clustering=globals.monitoringSettings['clustering']['clustering']
    data=globals.monitoringSettings['clustering']['data']
    vector=[fromLastUserRequest, 0 if request.headers.get('Payload-Size') is None else int(request.headers.get('Payload-Size')), 0 if request.headers.get('Processing-Time') is None else float(request.headers.get('Processing-Time'))]
    cluster=clustering.predict(vector)
    if globals.status==globals.Status.assignment_monitoring:
        print(cluster)
        print(globals.monitoringSettings['validClusters'])
        if cluster not in globals.monitoringSettings['validClusters']:
            return jsonify({'status':'OK'})
        else:
            globals.abnormal_request_vectors.append(vector)
            globals.abnormal_requests.append({
                'ProcessingTime':0 if request.headers.get('Processing-Time') is None else float(request.headers.get('Processing-Time')),
                'PayloadSize': 0 if request.headers.get('Payload-Size') is None else int(request.headers.get('Payload-Size')),
                'FromLastUserRequest':fromLastUserRequest,
                'IP-Address' :request.headers.get('IP-Address'),
                'Date-time':request_time
            })
            print('abnormal cluster:\n')
            print(vector) 
            return jsonify({'status': 'ABNORMAL_CLUSTER'})   
    else:
        cluster_center=clustering.cluster_centers_[cluster][0]
        distance_from_center=euclidean_distances([vector], [cluster_center])[0][0]
        sameClusterIndexes=[]
        for  idx, label in enumerate(clustering.labels_):
            if label==cluster:
                sameClusterIndexes.append(idx)
        sameClusterCoords=list(map(lambda x:list(data[x]), sameClusterIndexes))
        distances=euclidean_distances(sameClusterCoords,[cluster_center])
        distances_flatten=[item for sublist in distances for item in sublist]
        max_distance=max(distances_flatten)
        proximity_index=distance_from_center/max_distance
        print('proximity index='+str(proximity_index))
        if proximity_index<=globals.monitoringSettings['maxProximityIndex']:
            return jsonify({'status':'OK'})
        else:
            print('abnormal request:\n')
            print(vector) 
            globals.abnormal_request_vectors.append(vector)
            globals.abnormal_requests.append({
                'ProcessingTime':0 if request.headers.get('Processing-Time') is None else float(request.headers.get('Processing-Time')),
                'PayloadSize': 0 if request.headers.get('Payload-Size') is None else int(request.headers.get('Payload-Size')),
                'FromLastUserRequest':fromLastUserRequest,
                'IP-Address' :request.headers.get('IP-Address'),
                'Date-time':request_time
            })
            return jsonify({'status': 'ABNORMAL_CLUSTER'})   
        # return jsonify({'distance':euclidean_distances([vector], [cluster_center])})
    # with open("data-sets/"+globals.get_report_name(), "a") as myfile:
    #     myfile.write(json.dumps(json_obj['request'],indent=4 )+'\n' )
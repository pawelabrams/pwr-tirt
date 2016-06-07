from flask import Flask, request, jsonify, Blueprint
import json
import time
from clusterer import clustering
from datetime import datetime
import globals
data_processor = Blueprint('data-processor', __name__, template_folder='templates')

@data_processor.route('/data-processor/getClustering', methods=['GET'])
def get_clustering():
    return jsonify(    clustering.get_clusters())
@data_processor.route('/data-processor/setValidClusters', methods=['POST'])
def set_assignment_monitoring_settings():
    validClusters= request.get_json(force=True)
    globals.monitoringSettings={
        'clustering': clustering.get_clustering(),
        'validClusters': validClusters,
        'outliersDetection':False
    }
    globals.status=globals.Status.assignment_ready
    return jsonify({'s':globals.monitoringSettings['validClusters']})
@data_processor.route('/data-processor/setOutliersDetection', methods=['POST'])
def set_outliers_monitoring_settings():
    if globals.status==globals.Status.outliers_started:
            globals.monitoringSettings={
                'clustering': clustering.get_clustering(),
                'outliersDetection':False,
                'maxProximityIndex':request.get_json(force=True)['proximityIndex']
            }
            globals.status=globals.Status.outliers_ready
            return jsonify({'status':'OK'})
    
 
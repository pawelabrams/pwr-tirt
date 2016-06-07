from flask import Flask, request, jsonify, Blueprint
import json
import time
from datetime import datetime
import globals
reporting = Blueprint('reporting', __name__, template_folder='templates')

@reporting.route('/reporting/getReport', methods=['GET'])
def get_report():
    if globals.status==globals.Status.outliers_monitoring or  globals.status==globals.Status.assignment_monitoring:
        return jsonify({'res':globals.abnormal_requests})
    else:
        return jsonify({'status':'status not set to monitoring'}) 
@reporting.route('/reporting/getGraphData', methods=['GET'])
def get_graph_data():
    if globals.status==globals.Status.outliers_monitoring or  globals.status==globals.Status.assignment_monitoring:
        return jsonify({'res':globals.abnormal_request_vectors})
    else:
        return jsonify({'status':'status not set to monitoring'}) 

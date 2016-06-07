from flask import Flask, request, jsonify, Blueprint
import json
import time
from datetime import datetime
import globals
panel = Blueprint('panel', __name__, template_folder='templates')

@panel.route('/panel/setStatus', methods=['GET', 'POST'])
def set_status():
    s=request.get_json(force=True)['status']
    globals.status=getattr(globals.Status, s)
    if status==globals.status.assignment_monitoring or status==globals.status.outliers_monitoring:
        globals.abnormal_clusters=[]
    return get_status()
 
@panel.route('/panel/getStatus')
def get_status():
    return jsonify({'status': str(globals.status.name)})
 
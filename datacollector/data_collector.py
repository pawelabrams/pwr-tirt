from flask import Flask, request, jsonify, Blueprint
import json
import time
from datetime import datetime
import globals
d_c = Blueprint('data_collector', __name__, template_folder='templates')

@d_c.route('/collect/')
def collect_request():
    if globals.status!=globals.Status.collecting_data:
        return jsonify({'message':'Status is not set to collecting_training_data, current status is: '+ str(globals.status)})
    global lastRequestTimePerIp
    request_time=datetime.now()
    requestTimestamp=time.mktime(request_time.timetuple())
    lastRequestTimestamp = globals.lastRequestTimePerIp[request.headers.get('IP-Address')] if request.headers.get('IP-Address') in globals.lastRequestTimePerIp else None
    fromLastUserRequest= -10000000 if lastRequestTimestamp is None else (requestTimestamp-lastRequestTimestamp)
    globals.lastRequestTimePerIp[request.headers.get('IP-Address')]=requestTimestamp
    json_obj =        {
            'ProcessingTime':0 if request.headers.get('Processing-Time') is None else float(request.headers.get('Processing-Time')),
            'PayloadSize': 0 if request.headers.get('Payload-Size') is None else int(request.headers.get('Payload-Size')),
            'FromLastUserRequest':fromLastUserRequest
        }
    globals.trainingData.append(json_obj)
    with open("data-sets/"+globals.get_report_name(), "a") as myfile:
        myfile.write(json.dumps(json_obj,indent=4 )+'\n' )
    return jsonify(json_obj)
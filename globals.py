from datetime import datetime
from enum import Enum
class Status(Enum):
    none=1
    collecting_data=2
    data_ready_for_clustering=3
    data_ready_for_labeling=4
    ready=5
    monitoring=6
    data_collected=7
    clustering_started=8
    data_clustered=9
    outliers_ready=10
    assignment_started=11
    assignment_ready=12
    outliers_monitoring=13
    assignment_monitoring=14
    outliers_started=15#rename to outliers_config_started
global lastRequestTime
lastRequestTime=None
global lastRequestTimePerIp
lastRequestTimePerIp = {}
global reportName
reportName=None
global status
status=Status.none
global monitoringSettings
monitoringSettings=None
global trainingData
trainingData=[]
global abnormal_requests
abnormal_requests=[]
global abnormal_request_vectors
abnormal_request_vectors=[]
def get_report_name():
    global reportName
    if reportName is None: 
        reportName='report'+datetime.now().strftime("%Y-%m-%d_%H_%M_%S")+'.txt'
    return reportName
      
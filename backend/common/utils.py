import os
from line_notify import LineNotify

def maybe_mkdir(p):
    if not os.path.exists(p):
        os.mkdir(p)

def save_pickle(fn, a):
    assert(type(a) != 'str') # Check parameter is not swapped!
    pickle.dump(a, open(fn,'wb'))

def load_pickle(fn): 
    return pickle.load(open(fn,'rb'))

def send_me_line_notify(msg):
    ACCESS_TOKEN = "JRpRy193rJQOPbCOeMiswJiRKcPDSd5T4UctTWHHgAI"

    notify = LineNotify(ACCESS_TOKEN)

    notify.send(msg)


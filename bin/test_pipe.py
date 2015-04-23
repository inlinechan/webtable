import sys, os
import shlex
from subprocess import Popen, PIPE

if __name__ == '__main__':
    script = 'python test_websocket_server.py'
    if len(sys.argv) > 1:
        script = sys.argv[1]
    p = Popen(shlex.split(script), stdin=PIPE)
    while True:
        line = sys.stdin.readline().strip()
        p.stdin.write(line + '\n')

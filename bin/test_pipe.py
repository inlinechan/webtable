import fileinput
import os
import re
import shlex
import sys
from subprocess import Popen, PIPE
from time import sleep

if __name__ == '__main__':
    script = 'python test_websocket_server.py'
    input_file = 'input'
    if len(sys.argv) > 1:
        input_file = sys.argv[1]

    if not os.path.exists(input_file):
        print("File({}) not found".format(input_file))
        sys.exit(1)

    p = Popen(shlex.split(script), stdin=PIPE)
    for line in fileinput.input(input_file):
        if re.match(r'^\s*$', line):
            p.terminate()
            break

        p.stdin.write(line.strip() + '\n')
        sleep(1)

    p.terminate()
    p.kill()
    sys.exit(0)

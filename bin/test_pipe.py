# Webtable is to show tabular data in plot form as well as table.
# Copyright (C) 2015  Hyungchan Kim <inlinechan@gmail.com>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

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

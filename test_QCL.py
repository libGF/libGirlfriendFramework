import unittest

import QCL

class QCLTests(unittest.TestCase):

    def setUp(self):
        self.qcl = QCL.QCL()

    def getGirlName(self):
        girl = self.getGirlFriend()
        print girl.name

    def testGirl(self):
        self.assertRaises(AttributeError, self.getGirlName)

def main():
    unittest.main()

if __name__ == '__main__':
    main()

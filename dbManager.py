"""
database manager functions
edits text file databases
Functions: fillDB(), searchDB()
"""

def fillDB(data):
    """
    This function will open memberDB and appends the data.
    input = type str
    example input = 'name money level daily\n'
    void
    """
    file = open("memberDB.txt","a")
    file.write(data)
    file.close()


def searchDB(data):
    """
    This function will open memberDB and search for name
    input = type str
    example input = 'name' 
    returns the entire line containing that data
    returns False if not found
    """
    file = open("memberDB.txt", "r")
    for line in file:
        if data in line:
            file.close()
            return line.split(" ")
    file.close()
    return False
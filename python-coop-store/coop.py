# coop.py
class Coop(object):
    """A coop where chickens post their scratches

    Attributes:
        coop_id: A string representing the unique identity of the coop
        chicken_name: A string representing the Chicken that owns the coop
        title: A string title for the coop
        date: A Datetime representing the update time of the coop
    """

    def __init__(self, coop_id, chicken_name, title, date):
        self.coop_id = coop_id
        self.chicken_name = chicken_name
        self.title = title
        self.date = date

    

"""
Author: Eduardo Villalpando

Firebase Firestore, like many databases, charges based on queries. 
For better cost reduction and efficiency, queries to the database
must be kept to a minimum. pt_DBCache allows us to the exactly that.

pt_DBCacheItem is a wrapper for any data type that is saved in memory.
It includes a last_update property consisting of the datetime it was 
saved. A key property allows to identify the object.

pt_DBCacheCollection stores items in a dictionary O(1) based on their key.
For better performance, it can only store a limited amount of objects
(max_size) each for a limited amount of time (max_time). The latter
is necessary to avoid data inconsistency.

Finally, the pt_DBCache class allows to generate and access collections
easily, without worrying about the implementation. 
"""
from datetime import datetime
class pt_DBCacheItem:
    key = None
    data = None
    last_update: datetime = None

    def __init__(self, key, data) -> None:
        self.key = key
        self.data = data
        self.last_update = datetime.now()

    def get_age(self):
        difference = datetime.now() - self.last_update
        return difference.total_seconds()

class pt_DBCacheCollection:
    __data: dict[pt_DBCacheItem] = {}
    max_size: int = 10
    max_time = 30
    def __init__(self, max_size: int=10, max_time: int = 10) -> None:
        self.max_size = max_size
        self.max_time = max_time

    def get_data(self, key: str) -> pt_DBCacheItem.data:
        if key in self.__data and self.__data[key].get_age() < self.max_time:
            print("Cached data")
            return self.__data[key].data
        else:
            print("Not cached data")
            return None
    
    def add_data(self, key: str, data) -> bool:
        item = pt_DBCacheItem(key, data)
        if len(self.__data) >= self.max_size:
            # Get oldest record and delete
            oldest_key = max(self.__data, key = lambda k: self.__data[k].get_age())
            del self.__data[oldest_key]
            # Add
        self.__data[key] = item
        return True

    def remove_data(self, key: str) -> bool:
        if key in self.__data:
            del self.__data[key]
        return True

class pt_DBCache:
    collections: dict[pt_DBCacheCollection] = {}
    def __init__(self) -> None:
        pass

    def collection(self, name: str) -> pt_DBCacheCollection:
        # If not exists, create
        if name not in self.collections:
            self.collections[name] = pt_DBCacheCollection()
        # Return
        return self.collections[name]

cache = pt_DBCache()
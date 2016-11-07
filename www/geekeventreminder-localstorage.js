// This is a JavaScript file

var geekHolidayStorage = {
    collection: []
    };
    
geekHolidayStorage.init = function(){
    this.collection = JSON.parse(localStorage.getItem('geekHoliday') || '[]');
};

geekHolidayStorage.hasItem = function(label){
    return this.collection.some(function(item){
        return item.label === label;
    });
};
geekHolidayStorage.save = function(){
    localStorage.setItem('geekHoliday', JSON.stringify(this.collection));
};
geekHolidayStorage.add = function(label){
    if(this.hasItem(label)) {
        return false;
    }
    
    this.collection.push({
        label: label,
        status: "active"
        //TODO: figure out how to save a *date*
    });
    this.save();
    return true;
};

geekHolidayStorage.remove = function(label){
    if(!this.hasItem(label)) {
        return false;
    }
    this.collection.forEach(function(item, i){
        if(item.label === label) {
            this.collection.splice(i, 1);
        }
    }.bind(this));
    
    this.save();
    return true;
};

geekHolidayStorage.toggleStatus = function(label){
        if(!this.hasItem(label)) {
        return false;
    }
    this.collection.forEach(function(item, i){
        if(item.label === label) {
            item.status = item.status === 'active' ? 'disabled' : 'active';
        }
    });
    this.save();
    return true;
};

geekHolidayStorage.filter = function(status){
    if(status  === 'all') {
        return this.collection;
    }
    
    return this.collection.filter(function(item){
        return item.status === status;
    });
    
};
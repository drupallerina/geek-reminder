// This is a JavaScript file

var geekHoliday = {
    
    filterFlag: 'all',
    events: []
    
};

document.addEventListener('init', function(event){
    var view = event.target.id;
    
    if(view === 'menu' || view === 'list') {
        geekHoliday[view + 'Init'](event.target);
    }
}, false);

geekHoliday.listInit = function(target) {
    this.list = document.querySelector('#geek-holiday-list');
    
    target.querySelector('#splitter-toggle').addEventListener('click', function() {
        document.querySelector('#splitter-menu').open();
    });
    
    target.querySelector('#add').addEventListener('click', this.addItemPrompt.bind(this));
    
    geekHolidayStorage.init();
    this.refresh();
}
geekHoliday.addItemPrompt = function() {
    ons.notification.prompt('Insert new holiday title.', {
        title: 'New Item',
        cancelable: true,
        
        callback: function(label) {
            if(label === '' || label === null) {
                return;
            }
            
            if(geekHolidayStorage.add(label)) {
                this.refresh();
            } else {
                ons.notification.alert('Failed to add holiday to the list.');
            }
        }.bind(this)
    });
}

geekHoliday.refresh = function() {
    var items = geekHolidayStorage.filter(this.filterFlag);
    
    this.list.innerHTML = items.map(function(item){
       return document.querySelector('#geek-holiday-item').innerHTML
       .replace('{{label}}', item.label)
       .replace('{{checked}}', item.status === 'active' ? 'checked' : '');
    }).join('');
    
    var children = this.list.children;
    
    this.events.forEach(function(event, i) {
        event.element.removeEventListener('click', event.function);
    });
    
    this.events = [];
    
    var event = {};
    
    items.forEach(function(item, i) {
       event = {
           element: children[i].querySelector('ons-input'),
           function: this.toggleStatus.bind(this, item.label)
       };
       this.events.push(event);
       event.element.addEventListener('click', event.function);
       
       event = {
           element: children[i].querySelector('ons-icon'),
           function: this.removeItemPrompt.bind(this, item.label)
       };
       this.events.push(event);
       event.element.addEventListener('click', event.function);
    }.bind(geekHoliday));

}

geekHoliday.toggleStatus = function(label) {
    if(geekHolidayStorage.toggleStatus(label)) {
        this.refresh();
    } else {
        ons.notification.alert('Failed to change the status of the holiday.');
    }
}

geekHoliday.removeItemPrompt = function(label) {
    ons.notification.confirm('Are you sure you want to delete' + label+ 'from the holiday list?', {
        title: 'Remove holiday?',
        
        callback: function(answer){
            if(answer === 1) {
                if(geekHolidayStorage.remove(label)) {
                    this.refresh();
                } else {
                    ons.notification.alert('Failed to remove holiday from list.');
                }
            }
        }.bind(this)
    });
}

geekHoliday.menuInit = function(target) {
    target.querySelector('ons-list').addEventListener('click', this.filter.bind(this));
}

geekHoliday.filter = function(evt) {
    this.filterFlag = evt.target.parentElement.getAttribute('data-filter') || 'all';
    this.refresh();
}
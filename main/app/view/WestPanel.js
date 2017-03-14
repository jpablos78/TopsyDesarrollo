Ext.define('Tree.view.WestPanel', {
    extend: 'Ext.tree.Panel',
    title: 'Opciones',
    alias: 'widget.tvwestpanel',
    
    initComponent: function() {
        var store = Ext.create('Ext.data.TreeStore', {
            root : {
                expanded : true,
                children : [ {
                    text : "Menu Item Asasas",
                    leaf : true
                }, {
                    text : "Menu Item B",
                    leaf : true
                }, {
                    text : "Menu Item C",
                    expanded: true,
                    children: [
                    {
                        text: "Sub Menu Option 2.1", 
                        leaf: true
                    },

                    {
                        text: "Sub Menu Option 2.2", 
                        leaf: true
                    }
                    ]
                }, {
                    text : "Menu Item D",
                    leaf : true
                } ]
            }                        
        });
        
        this.store = store;
        this.rootVisible = false;
            this.listeners = {
                itemclick : function(tree, record, item, index, e, options) {
        
                    var nodeText = record.data.text;
        
                    var tabPanel = viewport.items.get(1);
                    var tabBar = tabPanel.getTabBar();
        
                    for ( var i = 0; i < tabBar.items.length; i++) {
                        if (tabBar.items.get(i).getText() === nodeText) {
                            var tabIndex = i;
                        }
                    }
        
                    if (Ext.isEmpty(tabIndex)) {
                        tabPanel.add({
                            title : record.data.text,
                            bodyPadding : 10,
                            html : record.data.text
                        });
        
                        tabIndex = tabPanel.items.length - 1;
                    }
        
                    tabPanel.setActiveTab(tabIndex);
                }
            }
        this.callParent(arguments);
    }
    
});


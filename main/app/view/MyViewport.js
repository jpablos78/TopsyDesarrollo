Ext.define('Tree.view.MyViewport', {
    extend: 'Ext.container.Viewport',
    alias: 'widget.myviewport',
    requires: ['Tree.view.WestPanel'],
   
    layout: 'border',
    items:[
    {
        region: 'north',
        //title: 'Norte',
        margins: 5,
        height: 100,
        xtype: 'container'
    },
    {
        region: 'west',
        title: 'Oeste',
        margins: '0 5 0 5',
        flex: .3,
        collapsible: true,
        split: true,
        titleCollapse: true,
        xtype: 'tvwestpanel'
    },
    {
        region: 'center',
        title: 'Centro'
    }//,
//    {
//        region: 'east',
//        title: 'Este',
//        margins: '0 5 0 5',
//        width: 200,
//        collapsible: true,
//        collapsed: true
//    },
//    {
//        region: 'south',
//        title: 'SUR',
//        margins: '0 5 5 5',
//        flex: .3,
//        split: true
//    }
    ]
});



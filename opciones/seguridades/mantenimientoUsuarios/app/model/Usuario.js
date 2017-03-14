Ext.define('Usuarios.model.Usuario', {
   extend: 'Ext.data.Model',
   
   fields: [
       {
           name: 'us_codigo',
           type: 'int'
       },
       {
           name: 'pe_codigo',
           type: 'int'
       },
       {
           name: 'pe_desc',
           type: 'string'
       },
       {
           name: 'us_login',
           type: 'string'
       },
       {
           name: 'us_nombres',
           type: 'string'
       },
       {
           name: 'us_apellidos',
           type: 'string'
       },
       {
           name: 'us_nombres_apellidos',
           type: 'string'
       },
       {
           name: 'us_email',
           type: 'string'
       },
       {
           name: 'us_pass',
           type: 'string'
       },
       {
           name: 'us_estado',
           type: 'string'
       },
       {
           name: 'us_desc_estado',
           type: 'string'
       },
       {
           name: 'us_es_ven',
           type: 'string'
       },
       {
           name: 'us_vis_ped',
           type: 'string'
       },
       {
           name: 'cci_vendedor',
           type: 'string'
       }
   ]
});



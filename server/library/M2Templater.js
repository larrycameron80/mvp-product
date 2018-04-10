/*простой шаблонизатор, который в переданном файле заменит все метки*/
const FS = require('fs');

module.exports = function () {
    this.view = function (template, options) {
         var NotificationHtmlTemplate = FS.readFileSync(template, 'utf-8');
         String.prototype.replaceAll = function(search, replacement) {
             var target = this;
             return target.replace(new RegExp(search, 'g'), replacement);
         };
         for(var i in options) {
             NotificationHtmlTemplate = NotificationHtmlTemplate.replaceAll('{{' + i + '}}', options[i]);
         }

         return NotificationHtmlTemplate;
     }
     return this;
};
/*
 * Definition of the base module. Base module contain some common components some one may use in
 * creating own application. These components are not a core part of BoilerplateJS, but available as samples.
 */
define(function(require) {

    // Load the dependencies
    var Boiler = require('Boiler'), 
        NavBarTopComponent = require('./mainShell/navBarTop/component'),
        NavBarBottomComponent = require('./mainShell/navBarBottom/component'),
        OverviewTab = require('./tabs/overviewTab/component'),
        ProductionTab = require('./tabs/productionTab/component'),
        FileTab = require('./tabs/fileTab/component'),
        WorkSetupTab = require('./tabs/workSetupTab/component'),
        ToolingTab = require('./tabs/toolingTab/component'),
        ConfigTab = require('./tabs/configTab/component');

    // Definition of the base Module as an object, this is the return value of this AMD script
    return {
        
        initialize : function(parentContext) {
            //create module context by assiciating with the parent context
            var context = new Boiler.Context(parentContext);

            var controller = new Boiler.DomController($('body'));
            //add routes with DOM node selector queries and relevant components
            controller.addRoutes({
                "#navbar_top_wrapper" : new NavBarTopComponent(context),
                "#navbar_bottom_wrapper" : new NavBarBottomComponent(context)
            });
            controller.start();

            var controller = new Boiler.UrlController($("#main-content"));
            var myOverviewTab = new OverviewTab(context);
            var myFileTab = new FileTab(context);
            var myWorkSetupTab = new WorkSetupTab(context);
            var myToolingTab = new ToolingTab(context);
            var myProductionTab = new ProductionTab(context);
            var myConfigTab = new ConfigTab(context);
            controller.addRoutes({
                "/" : myOverviewTab,      // DEFAULT landing page
                "1" : myFileTab,
                "2" : myWorkSetupTab,
                "3" : myToolingTab,
                "4" : myProductionTab,
                "5" : myConfigTab
            });
            controller.start();

            // error notifications
            parentContext.getSettings().linuxCNCServer.vars.error.data.subscribe(function(){
                try  {
                if (parentContext.getSettings().linuxCNCServer.vars.error.data().text.length > 0)
                {
                    $.pnotify({
                        type: "error",
                        title: "Controller Error",
                        text: parentContext.getSettings().linuxCNCServer.vars.error.data().text
                    });
                    parentContext.getSettings().linuxCNCServer.clearLastError();
                }
                } catch(ex) {}
            });

            var resizeFuncWithContext = function( jqElem )
            {
                if (!(jqElem instanceof jQuery))
                    jqElem = $('body');

                $('.fill-height',jqElem).each(function(idx,el){
                    if ($(el).is(":visible"))
                    {
                        var val = $(window).height() - $(el).offset().top - parseInt($('body').css('padding-bottom')) -  ( $(el).outerHeight(true) - $(el).height() ) - 20 ;
                        if ($(el).height() != val)
                            $(el).height( val  );
                    }
                });

            };

            $(window).resize( resizeFuncWithContext );
            resizeFuncWithContext();

            context.listen("ActivatedTabNeedsResize", resizeFuncWithContext);

            setInterval( resizeFuncWithContext, 1000 );

        }
        
    }

});
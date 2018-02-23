using ModFrameBase.Filters;

//Note: This layout is used by default, to change this change the "_ViewStart.cshtml"
public static partial class ModFrameLayouts
{
    //This can be used on any controller or controller action to use this layout
    public class DefaultLayout : BaseLayout
    {
        public DefaultLayout()
        {
            //Sets the name of the layout
            layoutName = "Default Layout";

            //Sets the includes ViewData name to use for this layout
            includeViewDataName = "defaultLayout";

            //Sets the master layout page location
            masterPageLocation = "~/layouts/default/views/main.cshtml";
        }
    }
}
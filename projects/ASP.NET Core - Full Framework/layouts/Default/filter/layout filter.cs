using ModFrameBase.Filters;

//Required layout outerlayer
public static partial class ModFrameLayouts
{
    //####################################################
    //########      Default Menu Layout Filter    ########
    //####################################################

    //This can be used on each controller to choose which menu to use
    public class DefaultLayout : BaseLayout
    {
        public DefaultLayout()
        {
            //Sets the name of the layout
            layoutName = "Default Layout";

            //Sets the includes viewdata name to use for the layout
            includeNames = "defaultLayout";

            //Sets the master layout page location
            masterPageLocation = "~/layouts/default/views/main.cshtml";
        }
    }
}
using ModFrameBase.Filters;

public static partial class ModFrameLayouts
{
    //This can be used on any controller or controller action to use this layout
    public class AnotherLayout : BaseLayout
    {
        public AnotherLayout()
        {
            //Sets the name of the layout
            layoutName = "Another Layout";

            //Sets the includes ViewData name to use for this layout
            includeViewDataName = "anotherLayout";

            //Sets the master layout page location
            masterPageLocation = "~/layouts/anotherlayout/views/main.cshtml";
        }
    }
}
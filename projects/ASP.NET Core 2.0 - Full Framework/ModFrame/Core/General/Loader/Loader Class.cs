//Below is an example of how to add functions that will automatically be loaded on start up
/*
public partial class ModFrameLoader
{
    public void LoadWebsiteCaches(LoaderParameter temp)
    {
        //This code will be loaded on the start up of the website booting up.
    }

    //As this does not have the LoaderParameter as a parameter this function will not be loaded
    private void WillNotBeLoaded()
    {
    }
}
*/

//This class is the basic definition that can then be extended to add as many extra functions to boot up cycle as required
public partial class ModFrameLoader
{   
}

//This is an empty class simply used to ensure only functions that have this in the parameter within ModFrameLoader are called.
//Note: This decision was made so you could have extra helper functions if required without the worry that they would also be called.
public class LoaderParameter
{
}



using System;
using System.Reflection;

public static partial class ModFrameLauncher
{
    public static void Load()
    {
        //Delcares the caching loader class instance to use
        ModFrameLoader loader = new ModFrameLoader();

        //This is used to ensure only functions with this class as a parameter are executed
        LoaderParameter parameter = new LoaderParameter();

        //Gets the type of class
        Type type = typeof(ModFrameLoader);

        //Gets all the methods for the class that are public
        MethodInfo[] info = type.GetMethods();

        //Loops over all the methods of the class
        foreach (MethodInfo mi in info)
        {
            //Checks the parameters of the method to ensure only methods with LoaderParameter are called.
            ParameterInfo[] param = mi.GetParameters();
            if (param != null && param.Length > 0 && param[0].ParameterType.FullName == typeof(LoaderParameter).ToString())
            {
                //Passes in the ModFrameLoader and processes the function
                mi.Invoke(loader, new object[] { parameter });
            }
        }
    }
}




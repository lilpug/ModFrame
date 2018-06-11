using Microsoft.AspNetCore.Routing;
using System;
using System.Reflection;

public static partial class ModFrame
{
    /// <summary>
    /// This function processes the ModFrameRouting functions and adds any extra required routing
    /// </summary>
    /// <param name="routes"></param>
    /// <returns></returns>
    public static IRouteBuilder CoreRoutesLoader(IRouteBuilder routes)
    {
        //Delcares the route loader class instance to use
        ModFrameRouting routeLoader = new ModFrameRouting();

        //Gets the type of class
        Type type = typeof(ModFrameRouting);

        //Gets all the methods for the class that are public
        MethodInfo[] info = type.GetMethods();

        //Loops over all the methods of the class
        foreach (MethodInfo mi in info)
        {
            //Checks the parameters of the method to ensure only methods with IRouteBuilder are called.
            //Note: all methods with IRouteBuilder type in this class are the only ones that are specifying any routes.
            ParameterInfo[] param = mi.GetParameters();
            if (param != null && param.Length == 1 && param[0].ParameterType.FullName == typeof(IRouteBuilder).ToString())
            {
                //Passes in the route builder and processes the function
                mi.Invoke(routeLoader, new object[] { routes });
            }
        }

        //Returns the route builder
        return routes;
    }
}
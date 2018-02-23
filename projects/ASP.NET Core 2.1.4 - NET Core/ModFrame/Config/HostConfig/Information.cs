using System;

public static partial class HostConfig
{
    //###################################################
    //####              Host Variable Config         ####
    //###################################################

    public static class Information
    {   
        public static string Example
        {
            get
            {
                try
                {   
                    return ModFrame.ConfigReader.GetSection($"{Core.ActiveConfiguration}:information:example").Value;
                }
                catch
                {
                    return null;
                }                
            }
        }
    }    
}

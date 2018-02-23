using System;

public static partial class HostConfig
{
    //###################################################
    //####              Host Variable Config         ####
    //###################################################

    public static class Core
    {   
        public static int SessionTimeout
        {
            get
            {
                try
                {                    
                    return Convert.ToInt32(ModFrame.ConfigReader.GetSection("core:session_timeout").Value);
                }
                catch
                {                    
                    return -1;
                }                
            }
        }
		
		public static string ActiveConfiguration
        {
            get
            {
                try
                {
                    return ModFrame.ConfigReader.GetSection("core:active_configuration").Value;
                }
                catch
                {                    
                    return null;
                }                
            }
        }
    }    
	
	  
}

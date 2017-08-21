using Microsoft.AspNetCore.Http;

public static partial class HttpRequestExtensions
{
    /// <summary>
    /// This function returns the base domain url including the schema
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    public static string GetBaseUrl(this HttpRequest request)
    {   
        if (!string.IsNullOrWhiteSpace(request.Scheme) && !string.IsNullOrWhiteSpace(request.Host.Value))
        {
            return $"{request.Scheme}://{request.Host.Value}/";            
        }
        return null;
    }
}
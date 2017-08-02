using Microsoft.AspNetCore.Http;

public static partial class HttpRequestExtensions
{
    public static string GetBaseUrl(this HttpRequest request)
    {
        if (!string.IsNullOrWhiteSpace(request.Scheme) && !string.IsNullOrWhiteSpace(request.Host.Value))
        {
            return string.Format("{0}://{1}/", request.Scheme, request.Host.Value);            
        }
        return null;
    }
}
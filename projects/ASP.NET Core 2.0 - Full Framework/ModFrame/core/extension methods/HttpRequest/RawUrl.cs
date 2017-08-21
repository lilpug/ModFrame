using System;
using Microsoft.AspNetCore.Http;

/// <summary>
/// <see cref="HttpRequest"/> extension methods.
/// </summary>
public static partial class HttpRequestExtensions
{   
    /// <summary>
    /// This function returns the current requests page url
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    public static string CurrentURL(this HttpRequest request)
    {
        if (string.IsNullOrEmpty(request.Scheme))
        {
            throw new InvalidOperationException("Missing Scheme");
        }
        if (!request.Host.HasValue)
        {
            throw new InvalidOperationException("Missing Host");
        }
        string path = (request.PathBase.HasValue || request.Path.HasValue) ? (request.PathBase + request.Path).ToString() : "/";
        return $"{request.Scheme}://{request.Host}{path}{request.QueryString}";
    }
}
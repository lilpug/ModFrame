using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

[Route("api")]
public partial class RestApiController : MyController
{
    // GET api/get_values

    [HttpGet]
    [Route("get_values")]
    public string[] GetValues()
    {
        return new string[] { "value1", "value2" };
    }

    // GET api/get_values
    // GET api/get_values/{id}

    [HttpGet]
    [Route("get_values2")]
    [Route("get_values2/{ID}")]
    public IActionResult GetValues2(ExampleModel model)
    {
        if (ModelState.IsValid)
        {
            return Ok(new string[] { $"1:{model.ID}", $"2:{model.ID}" });
        }
        else
        {
            var errors = new List<string>();            
            foreach (var state in ModelState)
            {
                foreach (var error in state.Value.Errors)
                {
                    errors.Add(error.ErrorMessage);
                }
            }

            return NotFound(errors);
        }
    }
}



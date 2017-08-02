using System.ComponentModel.DataAnnotations;

public class ExampleModel
{
    [Required]
    [StringLength(5)]
    [MinLength(1)]
    public string ID { get; set; }
}


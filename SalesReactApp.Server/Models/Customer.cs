using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace SalesReactApp.Server.Models;

public partial class Customer
{
    [Key]
    public int Id { get; set; }

    [Required(ErrorMessage = "The Name field is required.")]
    [StringLength(50, ErrorMessage = "The Address field must not exceed 50 characters in length.")]
    public string Name { get; set; } = null!;

    [Required(ErrorMessage = "The Address field is required.")]
    [StringLength(100, ErrorMessage = "The Address field must not exceed 100 characters in length.")]
    public string Address { get; set; } = null!;

    [NotMapped]
    public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace SalesReactApp.Server.Models;

public partial class Product
{
    [Key]
    public int Id { get; set; }

    [Required(ErrorMessage = "The Name field is required.")]
    [StringLength(80, ErrorMessage = "The Address field must not exceed 80 characters in length.")]
    public string Name { get; set; } = null!;

    [Column(TypeName = "decimal(10, 2)")]
    [Required(ErrorMessage = "Price must be specified")]
    public decimal Price { get; set; }

    [NotMapped]
    public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();
}

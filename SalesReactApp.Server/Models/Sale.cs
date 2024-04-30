using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace SalesReactApp.Server.Models;

public partial class Sale
{
    [Key]
    public int Id { get; set; }

    [Required(ErrorMessage = "CustomerID is required.")]
    public int CustomerId { get; set; }
    
    [Required(ErrorMessage = "Product ID is required.")]
    public int ProductId { get; set; }

    [Required(ErrorMessage = "Store ID is required.")]
    public int StoreId { get; set; }

    [Required(ErrorMessage = "Date Sold is required")]
    [DataType(DataType.Date)]
    public DateTime DateSold { get; set; }

    [ForeignKey("CustomerId")]
    public virtual Customer? Customer { get; set; }

    [ForeignKey("ProductId")]
    public virtual Product? Product { get; set; }

    [ForeignKey("StoreId")]
    public virtual Store? Store { get; set; }
}

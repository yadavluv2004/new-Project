const Listing=require("../models/listing");

module.exports.index=async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("./listings/index.ejs", { alllisting });
}

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
}

module.exports.showlisting=async (req, res, next) => {
        const { id } = req.params;
        const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    
        if (!listing) {
            req.flash("error", "No such Listing available");
            return res.redirect("/listings");  
        }
        console.log(listing);
        res.render("./listings/show.ejs", { listing });
    }

    module.exports.createListing = async (req, res, next) => {
        try {
            if (!req.body.listing) {
                req.flash("error", "Invalid listing data.");
                return res.redirect("/listings/new");
            }
    
            // Create a new listing with the form data
            const newListing = new Listing(req.body.listing);
            newListing.owner = req.user._id;
    
            // Ensure the file is uploaded before saving
            if (req.file) {
                newListing.image = { url: req.file.path, filename: req.file.filename };
            } else {
                req.flash("error", "Image upload failed.");
                return res.redirect("/listings/new");
            }
    
            // Save the new listing
            await newListing.save();
            req.flash("success", "New Listing added!");
            res.redirect(`/listings/${newListing._id}`);
        } catch (error) {
            console.error("Error in createListing:", error);
            req.flash("error", "Something went wrong while adding the listing.");
            res.redirect("/listings");
        }
    };

        module.exports.rendereditform=async (req, res, next) => {
                const { id } = req.params;
                const editlisting = await Listing.findById(id);
                if (!editlisting) {
                    req.flash("error", "No such Listing available for Editing");
                    return res.redirect("/listings");  // ✅ Fixed
                }
                res.render("./listings/edit.ejs", { editlisting });
        }

        module.exports.updateform=async (req, res) => {
                const { id } = req.params;
                if (req.body.listing.image) {
                    req.body.listing.image = {
                        url: req.body.listing.image,
                        filename: "listingimage",
                    };
                }
                const updatedListing = await Listing.findByIdAndUpdate(id, {
                    ...req.body.listing,
                });
                if(typeof req.file !== "undefined"){
                    let {url}=req.file.path;
                    let{filename}=req.file.filename;
                    updatedListing.image={url,filename};
                    updatedListing.save();
                }

                if (!updatedListing) {
                    throw new Expresserror(404, "Listing not found");
                }
                req.flash("success", "Successfully Listing Updated!");
                res.redirect(`/listings/${id}`);
            }

            module.exports.deletelisting=async (req, res) => {
                    const { id } = req.params;
                    const deletedListing = await Listing.findByIdAndDelete(id);
                    if (!deletedListing) {
                        throw new Expresserror(404, "Listing not found");
                    }
                    req.flash("success", "Listing Deleted Successfully!");
                    res.redirect("/listings");
                }


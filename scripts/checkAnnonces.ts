import dbConnect from '@/lib/mongodb';
import Annonce from '@/lib/models/Annonce';

async function checkAnnonces() {
  try {
    await dbConnect();
    
    // Get all annonces
    const annonces = await Annonce.find({}).lean();
    
    console.log(`Found ${annonces.length} annonces in the database.`);
    
    // Log the first few annonces to check their structure
    annonces.slice(0, 3).forEach((annonce, index) => {
      console.log(`\nAnnonce ${index + 1}:`);
      console.log({
        _id: annonce._id,
        title: annonce.title,
        price: annonce.price,
        surface: annonce.surface,
        rooms: annonce.rooms,
        address: annonce.address,
        source: annonce.source,
        hasCoordinates: !!(annonce.latitude && annonce.longitude)
      });
    });
    
    // Check for any missing required fields
    const invalidAnnonces = annonces.filter(a => !a.title || !a.source);
    if (invalidAnnonces.length > 0) {
      console.log(`\nFound ${invalidAnnonces.length} annonces with missing required fields.`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking annonces:', error);
    process.exit(1);
  }
}

checkAnnonces();

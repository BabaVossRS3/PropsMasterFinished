import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'

const About = () => {
  return (
    <div>
      <Header/>
      <div className="w-full flex flex-col items-center about-bg h-[100vh] mb-20">
        <h2 className='text-3xl text-[#E78430] text-center w-full p-20'>Γνωρίστε Μας</h2>
        <p className='w-[60%] text-center text-lg h-[350px]'>
          Καλώς ήρθατε στο <span className='text-[#E78430] font-bold text-xl'>PropsMaster</span>, την αξιόπιστη διαδικτυακή πλατφόρμα για λάτρεις και συλλέκτες αντικειμένων αντίκας. Είτε θέλετε να νοικιάσετε είτε να πουλήσετε αγαπημένα οικογενειακά κειμήλια ή να ανακαλύψετε διαχρονικούς θησαυρούς, είμαστε εδώ για να φέρουμε κοντά ενικοιαστές και αγοραστές που μοιράζονται το ίδιο πάθος για την ιστορία και την τέχνη.<br /><br />

          Στο <span className='text-[#E78430] font-bold text-xl'>PropsMaster</span>, κατανοούμε την αξία των αντικειμένων αντίκας — όχι μόνο την υλική τους αξία, αλλά και τις ιστορίες και τα συναισθήματα που κουβαλούν. Δημιουργήσαμε αυτήν την πλατφόρμα για να σας προσφέρουμε έναν ασφαλή και φιλικό τρόπο να ανεβάζετε τα αντικείμενά σας και να συνδέεστε με ενδιαφερόμενους αγοραστές για να κανονίσετε συναντήσεις και ενικοιάσεις.<br /><br />

          Είτε είστε συλλέκτης που ψάχνει για το επόμενο κομμάτι της συλλογής σας, είτε κάποιος που θέλει να δώσει μια νέα ζωή σε ένα παλιό αντικείμενο, το <span className='text-[#E78430] font-bold text-xl'>PropsMaster</span> είναι το ιδανικό μέρος για εσάς.

          Ελάτε μαζί μας και ανακαλύψτε τη μαγεία του παρελθόντος!
        </p>

      </div>
      <Footer className='mt-20'/>
    </div>
  )
}

export default About

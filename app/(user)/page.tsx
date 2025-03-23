import Form from "../components/Form";
import Popular from "../components/Popular";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FormSearchBar } from "../components/Search_fresh";


export default function Home() {
  return (
    <>
      <FormSearchBar/>
      <Popular/>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Συχνές Ερωτήσεις</h2>
        <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Τι είναι το gov.gr;
          </AccordionTrigger>
          <AccordionContent>
          Το gov.gr είναι η νέα Ενιαία Ψηφιακή Πύλη της Δημόσιας Διοίκησης για πολίτες και επιχειρήσεις. 
          Φιλοξενεί όλες τις ψηφιακές υπηρεσίες των υπουργείων, φορέων, οργανισμών και ανεξάρτητων αρχών του Δημοσίου που παρέχονται μέσω διαδικτύου. 
          Οι πολίτες και οι επιχειρήσεις μπορούν να υποβάλλουν και να επικυρώνουν ηλεκτρονικά, με ασφάλεια και εξ αποστάσεως, ευρύτατης χρήσης έγγραφα όπως εξουσιοδοτήσεις και υπεύθυνες δηλώσεις, καθώς και πολλές άλλες ηλεκτρονικές υπηρεσίες.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Πως εγγράφομαι στην υπηρεσία;
          </AccordionTrigger>
          <AccordionContent>
          Πατώντας το κουμπί πάνω δεξία που λέει σύνδεση και έπειτα εγγραφή μπορείτε να εγγραφείται στην υπηρεσία.
          Θα σας ζητηθεί να πληκτρολογίσετε το όνομα σας, το email, και έναν κωδικό που θα χρησιμοποιείτε
          για να έχετε πρόσβαση.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Πως υποβάλω μια αίτηση;
          </AccordionTrigger>
          <AccordionContent>
            Πηγαίνοντας στην σελίδα με την κατηγορίες, πατάτε σε αυτή που ταιριάζει στο αίτημα σας,
            έπειτα βρίσκετε την φόρμα που θέλετε, και πατώντας την ανακατευθύνεστε στην σελίδα της.
            Πατώντας συμπλήρωση θα ανακατευθυνθείτε σε σελίδα που θα
            εμφανιστεί μια φόρμα με τα πεδία που θα πρέπει να συμπληρώσετε
            για να ολοκληρωθεί το αίτημα σας. 
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Πως βλέπω τις αιτήσεις που έχω υποβάλει;
          </AccordionTrigger>
          <AccordionContent>
            Πατώντας στο μενού τα αρχικά του ονόματο σας, εμφανίζεται ένα μικρότερο μενού, εκεί πατάτε συμπληρωμένες φόρμες
            και θα ανακατευθυνθείτε στην σελίδα με τις αιτήσεις που έχετε υποβάλει. 
            Πατώντας προβολή, θα μπορείτε να δείτε παραπάνω στοιχεία για την φόρμα, όπως τα στοιχεία που έχετε υποβάλει,
            αλλά και την απάντηση του υπαλλήλου που έχει αναλάβει το αίτημα σας. 
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>Πως συμπληρώνω τα προσωπικά μου στοιχεία?
          </AccordionTrigger>
          <AccordionContent>
            Πατώντας στο μενού τα αρχικά του ονόματο σας, εμφανίζεται ένα μικρότερο μενού, εκεί πατάτε Τα Στοιχεία Μου
            και θα ανακατευθυνθείτε στην σελίδα με τα προσωπικά σας στοιχεία. 
            Συμπληρώνοντας τα προσωπικά σας στοιχεία, αυτά θα συμπληρώνονται αυτόματα κάθε φορά που υποβάλεται μια φόρμα.
          </AccordionContent>
        </AccordionItem>
      <AccordionItem value="item-6">
        <AccordionTrigger>Με ποια συσκευή μπορώ να έχω πρόσβαση;
        </AccordionTrigger>
        <AccordionContent>
        Μπορείτε να έχετε πρόσβαση στις υπηρεσίες με το κινητό σας τηλέφωνο, tablet ή ηλεκτρονικό υπολογιστή.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
</div>
    </>
  );
}
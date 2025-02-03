import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast"
import Header from './Header';
import Footer from './Footer';

const ReportUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const [reportedUserDetails, setReportedUserDetails] = useState(null);
  const [listingDetails, setListingDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    reason: '',
    details: ''
  });

  useEffect(() => {
    if (location.state?.productDetail) {
      setReportedUserDetails({
        username: location.state.productDetail.ownerName,
        email: location.state.productDetail.createdBy
      });
      setListingDetails({
        id: location.state.productDetail.id,
        title: location.state.productDetail.listingTitle
      });
    }
  }, [location]);

  const reportReasons = [
    { value: 'inappropriate_username', label: 'Ακατάλληλο όνομα χρήστη' },
    { value: 'inappropriate_profile_image', label: 'Ακατάλληλη εικόνα προφίλ χρήστη' },
    { value: 'inappropriate_listing_title', label: 'Ακατάλληλη ονομασία αγγελίας' },
    { value: 'inappropriate_listing_description', label: 'Ακατάλληλη περιγραφή αγγελίας' },
    { value: 'stolen_item', label: 'Το αντικείμενο είναι κλεμμένο' },
    { value: 'scam', label: 'Ο χρήστης είναι απάτη' }
  ];

  const sendReportEmail = async (reportData) => {
    setIsSubmitting(true);

    const emailData = {
      reported_username: reportedUserDetails.username,
      reported_email: reportedUserDetails.email,
      listing_id: listingDetails.id,
      listing_title: listingDetails.title,
      reporter_name: user?.fullName || user?.username,
      reporter_email: user?.primaryEmailAddress?.emailAddress,
      report_reason: reportReasons.find(r => r.value === reportData.reason)?.label,
      report_details: reportData.details
    };

    try {
      // Using the complete URL
      const response = await axios.post('https://propsmaster.gr/api/send-report-email', emailData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Email response:', response.data);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reportedUserDetails || !listingDetails) {
      toast({
        title: "Σφάλμα",
        description: "Δεν βρέθηκαν πληροφορίες για τον χρήστη που αναφέρθηκε",
        variant: "destructive",
      });
      return;
    }

    try {
      await sendReportEmail(formData);
      toast({
        title: "Επιτυχία",
        description: "Η αναφορά στάλθηκε με επιτυχία",
      });
      navigate(-1); // Go back to previous page
    } catch (error) {
      toast({
        title: "Σφάλμα",
        description: "Υπήρξε πρόβλημα κατά την αποστολή της αναφοράς",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReasonSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      reason: value
    }));
  };

  if (!reportedUserDetails || !listingDetails || !user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Φόρτωση πληροφοριών...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
        <Header/>
        <Card className="w-full m-10 max-w-2xl mx-auto">
            <CardHeader>
            <CardTitle>Αναφορά Χρήστη: {reportedUserDetails.username}</CardTitle>
            <CardDescription>
                Αναφορά για την αγγελία: {listingDetails.title} (ID: {listingDetails.id})
            </CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                <Label htmlFor="reporterName">Όνομα</Label>
                <Input
                    id="reporterName"
                    value={user?.fullName || user?.username}
                    disabled
                    className="bg-gray-50"
                />
                </div>

                <div className="space-y-2">
                <Label htmlFor="reporterEmail">Email</Label>
                <Input
                    id="reporterEmail"
                    type="email"
                    value={user?.primaryEmailAddress?.emailAddress}
                    disabled
                    className="bg-gray-50"
                />
                </div>

                <div className="space-y-2">
                <Label htmlFor="reason">Λόγος αναφοράς</Label>
                <Select
                    required
                    value={formData.reason}
                    onValueChange={handleReasonSelect}
                >
                    <SelectTrigger>
                    <SelectValue placeholder="Επιλέξτε λόγο αναφοράς" />
                    </SelectTrigger>
                    <SelectContent>
                    {reportReasons.map((reason) => (
                        <SelectItem key={reason.value} value={reason.value}>
                        {reason.label}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                </div>

                <div className="space-y-2">
                <Label htmlFor="details">Λεπτομέρειες</Label>
                <Textarea
                    id="details"
                    name="details"
                    required
                    value={formData.details}
                    onChange={handleChange}
                    placeholder="Παρακαλώ περιγράψτε το πρόβλημα με περισσότερες λεπτομέρειες"
                    className="h-32"
                />
                </div>

                <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
                >
                {isSubmitting ? 'Αποστολή...' : 'Υποβολή Αναφοράς'}
                </Button>
            </form>
            </CardContent>
        </Card>
        <Footer/>
    </>
    
  );
};

export default ReportUser;
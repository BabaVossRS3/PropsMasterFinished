import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';  // Import useSearchParams to get the query parameter
import Header from '@/components/Header';
import MyListings from './components/MyListings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MyProfile from './components/MyProfile';
import Footer from '@/components/Footer';

const Profile = () => {
  // Fetch totalListings from MyListings or set state here
  const [totalListings, setTotalListings] = useState(0);

  return (
    <div className="neaKataxwrisi-profile-container">
      <Header />
      <div className="neaKataxwrisi-tabs-wrapper">
        <Tabs defaultValue="my-listings" className="neaKataxwrisi-tabs">
          <TabsList className="neaKataxwrisi-tabs-list gap-3">
            <TabsTrigger className="neaKataxwrisi-tabs-trigger" value="my-listings">
              Οι Αγγελίες Μου
            </TabsTrigger>
            <TabsTrigger className="neaKataxwrisi-tabs-trigger" value="my-profile">
              Λογαριασμός
            </TabsTrigger>
          </TabsList>
          <TabsContent value="my-listings" className="neaKataxwrisi-tabs-content">
            <MyListings setTotalListings={setTotalListings} /> {/* Pass setTotalListings to MyListings */}
          </TabsContent>
          <TabsContent value="my-profile" className="neaKataxwrisi-tabs-content">
            <MyProfile totalListings={totalListings} /> {/* Pass totalListings prop */}
          </TabsContent>
        </Tabs>
      </div>
      <Footer/>
    </div>
  );
};

export default Profile;

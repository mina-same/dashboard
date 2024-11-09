"use client";

import React, { useEffect, useState } from "react";

const ProductDescriptionEditor = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    // Set the HTML content
    setContent(`
        <div 
  class="tab-pane fade show active" 
  id="prodcut-details" 
  role="tabpanel" 
  aria-labelledby="prodcut-details-tab" 
  dir="rtl" 
  style="text-align: right; font-family: 'Cairo', 'NeoSansArabic', 'Tahoma', 'Arial', sans-serif; line-height: 1.8;">

  <p style="font-weight: 400;">شحن برنامج هوا شات بالايدي رسمي عبر الايدي فوري</p>

  <p style="font-weight: 400;">الخطوات:</p>
  <ul style="padding-right: 20px; list-style-type: disc;">
    <li>كتابة رقم الايدي في الخانة</li>
    <li>اضافة الباقة الى السلة</li>
    <li>اكمال عملية الدفع</li>
    <li>مبروك عليك الشحن</li>
  </ul>

  <p style="font-weight: 400;">
    اذا تأخر الشحن عن ١٥ دقيقة تواصل مباشرة مع الدعم الفني
  </p>

  <p style="font-weight: 700; color: rgb(113, 121, 128);">
    أوقات التنفيذ: من 10 ص إلى 5 الفجر، وتتوقف أنظمتنا بين الساعة 5 الفجر إلى 9 صباحاً لأعمال الصيانة
  </p>

</div>

        `);
  }, []);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: content }}
      className="p-4 w-50"
      dir="rtl" // This makes the content right-to-left
    />
  );
};

export default ProductDescriptionEditor;

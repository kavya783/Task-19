import React, { memo } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

import Facebook from "@mui/icons-material/Facebook";
import Instagram from "@mui/icons-material/Instagram";
import YouTube from "@mui/icons-material/YouTube";
import Twitter from "@mui/icons-material/Twitter";

import { Theme } from "../themes/GlobalStyles";
import Colors from "../themes/colors";

// ========================================
// ABOUT LINKS
// ========================================

const aboutLinks = [
  {
    name: "About us",
    link: "https://mamaearth.in/pages/our-story",
  },
  {
    name: "Track Order",
    link: "https://mamaearth.in/pages/order-track",
  },
  {
    name: "Contact Us",
    link: "https://mamaearth.in/pages/contact",
  },
  {
    name: "Blog",
    link: "https://mamaearth.in/blogs/blog",
  },
  {
    name: "Stores",
    link: "https://mamaearth.in/pages/mamaearth-store",
  },
  {
    name: "Sitemap",
    link: "https://mamaearth.in/pages/sitemap",
  },
  {
    name: "Request Replacement/Returns",
    link: "https://mamaearthprod.myshopify.com/apps/return_prime",
  },
];

// ========================================
// TOP CATEGORIES
// ========================================

const topCategories = [
  {
    name: "Face Wash",
    link: "https://mamaearth.in/collections/face-wash",
  },
  {
    name: "Hair-care",
    link: "https://mamaearth.in/collections/hair",
  },
  {
    name: "Baby Care Product",
    link: "https://mamaearth.in/collections/baby",
  },
  {
    name: "Body Care Product",
    link: "https://mamaearth.in/collections/body-care",
  },
  {
    name: "Gift Packs",
    link: "https://mamaearth.in/collections/gift-packs",
  },
  {
    name: "Sunscreen",
    link: "https://mamaearth.in/collections/sunscreen",
  },
  {
    name: "Face Cream",
    link: "https://mamaearth.in/collections/face-cream",
  },
  {
    name: "Hair Shampoo",
    link: "https://mamaearth.in/collections/shampoo",
  },
  {
    name: "Hair Oil",
    link: "https://mamaearth.in/collections/hair-oil",
  },
  {
    name: "Sunscreen for Dry skin",
    link: "https://mamaearth.in/collections/best-sunscreen-for-dry-skin",
  },
  {
    name: "Face Moisturizer",
    link: "https://mamaearth.in/collections/face-moisturizer",
  },
  {
    name: "Makeup & Lip Care",
    link: "https://mamaearth.in/collections/makeup",
  },
  {
    name: "Plant",
    link: "https://mamaearth.in/pages/plant",
  },
  {
    name: "Skin care product",
    link: "https://mamaearth.in/collections/skin",
  },
  {
    name: "Onion",
    link: "https://mamaearth.in/collections/onion-products",
  },
  {
    name: "Rosemary",
    link: "https://mamaearth.in/collections/rosemary-range",
  },
  {
    name: "Rice-Range",
    link: "https://mamaearth.in/collections/rice-range",
  },
  {
    name: "Face serum",
    link: "https://mamaearth.in/collections/face-serum-for-glowing-skin",
  },
  {
    name: "Lipstick",
    link: "https://mamaearth.in/collections/lipsticks",
  },
  {
    name: "Body lotion",
    link: "https://mamaearth.in/collections/body-lotion",
  },
  {
    name: "combo",
    link: "https://mamaearth.in/collections/combos",
  },
  {
    name: "kajal",
    link: "https://mamaearth.in/collections/eye-kajal",
  },
  {
    name: "Lip Balm",
    link: "https://mamaearth.in/collections/lip-balm",
  },
  {
    name: "Ubtan",
    link: "https://mamaearth.in/collections/ubtan",
  },
  {
    name: "All Product",
    link: "https://mamaearth.in/collections/all-products",
  },
];

// ========================================
// INFORMATION LINKS
// ========================================

const informationLinks = [
  {
    name: "Privacy Policy",
    link: "https://mamaearth.in/pages/privacy-policy",
  },
  {
    name: "Return Policy",
    link: "https://mamaearth.in/pages/return-policy",
  },
  {
    name: "Terms & Conditions",
    link: "https://mamaearth.in/pages/terms-conditions",
  },
  {
    name: "T&C - 30-Day Money-Back",
    link: "https://mamaearth.in/pages/30-day-money-back-guarantee",
  },
  {
    name: "T&C- Cashback",
    link: "https://mamaearth.in/pages/terms-and-conditions-cashback",
  },
  {
    name: "T&C - B1G1",
    link: "https://mamaearth.in/pages/terms-conditions-b1g1",
  },
];

// ========================================
// FOOTER LINK
// ========================================

const FooterLink = memo(function FooterLink({ name, link }) {
  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      underline="none"
      sx={{
        display: "block",
        color: Colors.black,
        fontSize: Theme.font12Regular,
        lineHeight: 1.8,
        mb: 0.5,
        transition: "color 0.2s ease",

        "&:hover": {
          color: Colors.green,
        },
      }}
    >
      {name}
    </Link>
  );
});

// ========================================
// FOOTER
// ========================================

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        backgroundColor: Colors.background,
        borderTop: `1px solid ${Colors.green}`,
        boxSizing: "border-box",
      }}
    >
      {/* MAIN FOOTER */}

      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          mx: "auto",

          px: {
            xs: 2,
            sm: 4,
            md: 5,
          },

          py: {
            xs: 4,
            sm: 5,
            md: 6,
          },

          boxSizing: "border-box",
        }}
      >
        {/* MAIN 4 COLUMN GRID */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 2fr 1.5fr",
            },

            gap: {
              xs: 4,
              sm: 5,
              md: 4,
            },

            minWidth: 0,
          }}
        >
          {/* LOGO */}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",

              alignItems: {
                xs: "center",
                sm: "flex-start",
              },

              textAlign: {
                xs: "center",
                sm: "left",
              },

              minWidth: 0,
            }}
          >
            <Box
              component="img"
              src="/images/ME_New.avif"
              alt="Mamaearth"
              width={210}
              height={80}
              loading="lazy"
              decoding="async"
              sx={{
                width: {
                  xs: 150,
                  sm: 190,
                  md: 210,
                },

                maxWidth: "100%",
                height: "auto",
                objectFit: "contain",
                mb: 2,
              }}
            />

            <Typography
              sx={{
                fontSize: Theme.font12Regular,
                color: Colors.black,
                lineHeight: 1.7,
                maxWidth: "220px",
              }}
            >
              Goodness inside.
              <br />
              Goodness outside.
            </Typography>
          </Box>

          {/* ABOUT US */}

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: Theme.font14SemiBold,
                fontWeight: 600,
                color: Colors.black,
                mb: 1.5,
              }}
            >
              About Us
            </Typography>

            {aboutLinks.map((item) => (
              <FooterLink
                key={item.name}
                name={item.name}
                link={item.link}
              />
            ))}
          </Box>

          {/* TOP CATEGORIES */}

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: Theme.font14SemiBold,
                fontWeight: 600,
                color: Colors.black,
                mb: 1.5,
              }}
            >
              Top Categories
            </Typography>

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr 1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr",
                },

                columnGap: 3,
                minWidth: 0,
              }}
            >
              {topCategories.map((item) => (
                <FooterLink
                  key={item.name}
                  name={item.name}
                  link={item.link}
                />
              ))}
            </Box>
          </Box>

          {/* INFORMATION */}

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: Theme.font14SemiBold,
                fontWeight: 600,
                color: Colors.black,
                mb: 1.5,
              }}
            >
              Information
            </Typography>

            {informationLinks.map((item) => (
              <FooterLink
                key={item.name}
                name={item.name}
                link={item.link}
              />
            ))}

            {/* SOCIAL MEDIA */}

            <Typography
              sx={{
                fontSize: Theme.font14SemiBold,
                fontWeight: 600,
                color: Colors.black,
                mt: 3,
                mb: 1,
                lineHeight: 1.4,
              }}
            >
              show us some love ♥ on social media
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Link
                href="https://www.facebook.com/mamaearth.in"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                sx={{
                  color: Colors.black,
                  display: "flex",

                  "&:hover": {
                    color: Colors.green,
                  },
                }}
              >
                <Facebook />
              </Link>

              <Link
                href="https://www.instagram.com/mamaearth.in/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                sx={{
                  color: Colors.black,
                  display: "flex",

                  "&:hover": {
                    color: Colors.green,
                  },
                }}
              >
                <Instagram />
              </Link>

              <Link
                href="https://www.youtube.com/@Mamaearth"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                sx={{
                  color: Colors.black,
                  display: "flex",

                  "&:hover": {
                    color: Colors.green,
                  },
                }}
              >
                <YouTube />
              </Link>

              <Link
                href="https://twitter.com/mamaearthindia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                sx={{
                  color: Colors.black,
                  display: "flex",

                  "&:hover": {
                    color: Colors.green,
                  },
                }}
              >
                <Twitter />
              </Link>
            </Box>
          </Box>
        </Box>

        {/* TRUST + SERVICES */}

        <Box
          sx={{
            borderTop: "1px solid rgba(0,0,0,0.1)",
            borderBottom: "1px solid rgba(0,0,0,0.1)",

            py: {
              xs: 2.5,
              sm: 3,
            },

            mt: {
              xs: 4,
              sm: 5,
            },

            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },

              gap: {
                xs: 3,
                md: 2,
              },

              alignItems: "center",
            }}
          >
            {/* TRUST BADGES */}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "repeat(3, minmax(0, 1fr))",
                  sm: "repeat(3, minmax(0, 1fr))",
                },

                gap: {
                  xs: 0.5,
                  sm: 2,
                  md: 2.5,
                },

                width: "100%",
                minWidth: 0,
              }}
            >
              {/* Dermatologically Tested */}

              <Link
                href="https://mamaearth.in/pages/were-safe-2"
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                sx={{
                  minWidth: 0,
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    width: "100%",
                    minWidth: 0,
                  }}
                >
                  <Box
                    component="img"
                    src="/images/Rectangle.avif"
                    alt="Dermatologically Tested"
                    width={75}
                    height={75}
                    loading="lazy"
                    decoding="async"
                    sx={{
                      width: {
                        xs: 48,
                        sm: 65,
                        md: 75,
                      },

                      height: {
                        xs: 48,
                        sm: 65,
                        md: 75,
                      },

                      objectFit: "contain",
                      display: "block",
                      mx: "auto",
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: {
                        xs: 10,
                        sm: Theme.font12Regular,
                      },

                      color: Colors.black,
                      mt: 0.5,

                      lineHeight: 1.3,

                      whiteSpace: {
                        xs: "normal",
                        sm: "nowrap",
                      },

                      wordBreak: "normal",
                    }}
                  >
                    Dermatologically Tested
                  </Typography>
                </Box>
              </Link>

              {/* Made Safe Certified */}

              <Link
                href="https://mamaearth.in/pages/were-safe-2"
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                sx={{
                  minWidth: 0,
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    width: "100%",
                    minWidth: 0,
                  }}
                >
                  <Box
                    component="img"
                    src="/images/Rectangle1.webp"
                    alt="Made Safe Certified"
                    width={75}
                    height={75}
                    loading="lazy"
                    decoding="async"
                    sx={{
                      width: {
                        xs: 48,
                        sm: 65,
                        md: 75,
                      },

                      height: {
                        xs: 48,
                        sm: 65,
                        md: 75,
                      },

                      objectFit: "contain",
                      display: "block",
                      mx: "auto",
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: {
                        xs: 10,
                        sm: Theme.font12Regular,
                      },

                      color: Colors.black,
                      mt: 0.5,

                      lineHeight: 1.3,

                      whiteSpace: {
                        xs: "normal",
                        sm: "nowrap",
                      },
                    }}
                  >
                    Made Safe Certified
                  </Typography>
                </Box>
              </Link>

              {/* Cruelty Free */}

              <Link
                href="https://mamaearth.in/pages/were-safe-2"
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                sx={{
                  minWidth: 0,
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    width: "100%",
                    minWidth: 0,
                  }}
                >
                  <Box
                    component="img"
                    src="/images/Rectangle11.webp"
                    alt="Cruelty Free"
                    width={75}
                    height={75}
                    loading="lazy"
                    decoding="async"
                    sx={{
                      width: {
                        xs: 48,
                        sm: 65,
                        md: 75,
                      },

                      height: {
                        xs: 48,
                        sm: 65,
                        md: 75,
                      },

                      objectFit: "contain",
                      display: "block",
                      mx: "auto",
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: {
                        xs: 10,
                        sm: Theme.font12Regular,
                      },

                      color: Colors.black,
                      mt: 0.5,

                      lineHeight: 1.3,

                      whiteSpace: {
                        xs: "normal",
                        sm: "nowrap",
                      },
                    }}
                  >
                    Cruelty Free
                  </Typography>
                </Box>
              </Link>
            </Box>

            {/* SERVICES */}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "repeat(3, minmax(0, 1fr))",
                  sm: "repeat(3, minmax(0, 1fr))",
                },

                gap: {
                  xs: 0.5,
                  sm: 2,
                  md: 2.5,
                },

                width: "100%",
                minWidth: 0,
              }}
            >
              {/* Free Shipping */}

              <Box
                sx={{
                  textAlign: "center",
                  minWidth: 0,
                }}
              >
                <Box
                  component="img"
                  src="/images/free_shipping.webp"
                  alt="Free Shipping"
                  width={55}
                  height={55}
                  loading="lazy"
                  decoding="async"
                  sx={{
                    width: {
                      xs: 40,
                      sm: 50,
                      md: 55,
                    },

                    height: {
                      xs: 40,
                      sm: 50,
                      md: 55,
                    },

                    objectFit: "contain",
                    display: "block",
                    mx: "auto",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: {
                      xs: 10,
                      sm: Theme.font12Regular,
                    },

                    color: Colors.black,
                    mt: 0.5,

                    lineHeight: 1.3,

                    whiteSpace: {
                      xs: "normal",
                      sm: "nowrap",
                    },
                  }}
                >
                  Free Shipping
                </Typography>
              </Box>

              {/* Easy Return */}

              <Box
                sx={{
                  textAlign: "center",
                  minWidth: 0,
                }}
              >
                <Box
                  component="img"
                  src="/images/easy_return.webp"
                  alt="Easy Return"
                  width={55}
                  height={55}
                  loading="lazy"
                  decoding="async"
                  sx={{
                    width: {
                      xs: 40,
                      sm: 50,
                      md: 55,
                    },

                    height: {
                      xs: 40,
                      sm: 50,
                      md: 55,
                    },

                    objectFit: "contain",
                    display: "block",
                    mx: "auto",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: {
                      xs: 10,
                      sm: Theme.font12Regular,
                    },

                    color: Colors.black,
                    mt: 0.5,

                    lineHeight: 1.3,

                    whiteSpace: {
                      xs: "normal",
                      sm: "nowrap",
                    },
                  }}
                >
                  Easy Return
                </Typography>
              </Box>

              {/* COD Available */}

              <Box
                sx={{
                  textAlign: "center",
                  minWidth: 0,
                }}
              >
                <Box
                  component="img"
                  src="/images/cod.webp"
                  alt="COD Available"
                  width={55}
                  height={55}
                  loading="lazy"
                  decoding="async"
                  sx={{
                    width: {
                      xs: 40,
                      sm: 50,
                      md: 55,
                    },

                    height: {
                      xs: 40,
                      sm: 50,
                      md: 55,
                    },

                    objectFit: "contain",
                    display: "block",
                    mx: "auto",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: {
                      xs: 10,
                      sm: Theme.font12Regular,
                    },

                    color: Colors.black,
                    mt: 0.5,

                    lineHeight: 1.3,

                    whiteSpace: {
                      xs: "normal",
                      sm: "nowrap",
                    },
                  }}
                >
                  COD Available
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* COPYRIGHT + PAYMENT */}

        <Box
          sx={{
            py: 2.5,

            display: "flex",

            flexDirection: {
              xs: "column",
              sm: "row",
            },

            justifyContent: {
              xs: "center",
              sm: "space-between",
            },

            alignItems: "center",

            gap: 2,

            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* COPYRIGHT */}

          <Typography
            sx={{
              fontSize: Theme.font12Regular,
              color: Colors.black,

              textAlign: {
                xs: "center",
                sm: "left",
              },

              lineHeight: 1.5,
            }}
          >
            © 2026 Honasa Consumer Limited. All rights reserved.
          </Typography>

          {/* PAYMENT ICONS */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              gap: {
                xs: 0.8,
                sm: 1,
              },

              flexWrap: "wrap",

              maxWidth: "100%",
            }}
          >
            <Box
              component="img"
              src="/images/visa-b614b878.svg"
              alt="Visa"
              width={40}
              height={24}
              loading="lazy"
              decoding="async"
              sx={{
                width: "auto",
                height: {
                  xs: 20,
                  sm: 24,
                },
              }}
            />

            <Box
              component="img"
              src="/images/master-f5a74105.svg"
              alt="Mastercard"
              width={40}
              height={24}
              loading="lazy"
              decoding="async"
              sx={{
                width: "auto",
                height: {
                  xs: 20,
                  sm: 24,
                },
              }}
            />

            <Box
              component="img"
              src="/images/american_express-2bdbf0e2.svg"
              alt="American Express"
              width={40}
              height={24}
              loading="lazy"
              decoding="async"
              sx={{
                width: "auto",
                height: {
                  xs: 20,
                  sm: 24,
                },
              }}
            />

            <Box
              component="img"
              src="/images/rupay-866b7e37.svg"
              alt="RuPay"
              width={40}
              height={24}
              loading="lazy"
              decoding="async"
              sx={{
                width: "auto",
                height: {
                  xs: 20,
                  sm: 24,
                },
              }}
            />

            <Box
              component="img"
              src="/images/paytm-c8147fd8.svg"
              alt="Paytm"
              width={40}
              height={24}
              loading="lazy"
              decoding="async"
              sx={{
                width: "auto",
                height: {
                  xs: 20,
                  sm: 24,
                },
              }}
            />

            <Box
              component="img"
              src="/images/google_pay-34c30515.svg"
              alt="Google Pay"
              width={40}
              height={24}
              loading="lazy"
              decoding="async"
              sx={{
                width: "auto",
                height: {
                  xs: 20,
                  sm: 24,
                },
              }}
            />

            <Box
              component="img"
              src="/images/freecharge-e030814b.svg"
              alt="Freecharge"
              width={40}
              height={24}
              loading="lazy"
              decoding="async"
              sx={{
                width: "auto",
                height: {
                  xs: 20,
                  sm: 24,
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default memo(Footer);
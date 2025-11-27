"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Github, MessageCircle, Bitcoin, Coins, Twitter, Instagram, Send, Copy, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SiDiscord, SiTrustpilot } from "react-icons/si"

export function Contact() {
  const { toast } = useToast()

  const copyToClipboard = (text: string, currency: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Address Copied!",
        description: `${currency} address copied to clipboard`,
      })
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Failed to copy address to clipboard",
        variant: "destructive",
      })
    })
  }

  return (
    <section id="contact" className="py-20 sm:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6">
            Contact <span className="text-primary">NodeByte</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We are here to help you with all your hosting needs. Reach out to us for support, inquiries, or feedback.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm text-accent">
                <MessageCircle size={16} />
                <span>24/7 Friendly Support</span>
              </div>
              <h2 className="text-3xl font-bold">Fast, Friendly and Professional</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our support team is available 24/7 to assist you with any technical issues, account inquiries, or general questions you may have.
              </p>
            </div>

            <Card className="p-6 sm:p-8 bg-card/60 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Github size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">GitHub Discussions</h3>
                  <p className="text-muted-foreground mb-4">
                    Report bugs, suggest features, and get community support
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span>Report bugs and leave some feedback</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span>Reviewed within 48 hours</span>
                    </li>
                  </ul>
                  <a 
                    href="https://github.com/orgs/NodeByteHosting/discussions" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-primary hover:underline"
                  >
                    Visit GitHub Discussions →
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-6 sm:p-8 bg-card/60 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                  <Mail size={24} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">General Support</h3>
                  <p className="text-muted-foreground mb-4">
                    Technical support, account issues, billing inquiries
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent"></span>
                      <a href="mailto:support@nodebyte.host" className="text-primary hover:underline">
                        support@nodebyte.host
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent"></span>
                      <a href="mailto:accounts@nodebyte.host" className="text-primary hover:underline">
                        accounts@nodebyte.host
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent"></span>
                      <a href="mailto:billing@nodebyte.host" className="text-primary hover:underline">
                        billing@nodebyte.host
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent"></span>
                      <span>Response within 24 hours</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
                <Coins size={16} />
                <span>Stay in Touch With Us</span>
              </div>
              <h2 className="text-3xl font-bold">Support NodeByte</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Join our communities, stay updated with the latest news, and support our mission to provide secure and private hosting solutions.
              </p>
            </div>

            <Card className="p-6 sm:p-8 bg-card/60 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Join Our Community</h3>
                  <p className="text-muted-foreground">
                    Connect with us on social media and be part of our growing community. Get the latest updates, tips, and exclusive offers.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold mb-4">Connect</h4>
                  <div className="flex gap-4 mb-4">
                    <a
                      href="https://twitter.com/NodeByteHosting"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    >
                      <Twitter size={20} className="text-primary" />
                    </a>
                    <a
                      href="https://github.com/NodeByteHosting"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    >
                      <Github size={20} className="text-primary" />
                    </a>
                    <a
                      href="https://discord.gg/wN58bTzzpW"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    >
                      <SiDiscord size={20} className="text-primary" />
                    </a>
                    <a
                      href="https://uk.trustpilot.com/review/nodebyte.host"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    >
                      <SiTrustpilot size={20} className="text-primary" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <h5 className="font-semibold flex items-center gap-2">
                      <Twitter size={16} className="text-primary" />
                      Twitter
                    </h5>
                    <p className="text-sm text-muted-foreground">Latest updates and security tips</p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-semibold flex items-center gap-2">
                      <Github size={16} className="text-primary" />
                      GitHub
                    </h5>
                    <p className="text-sm text-muted-foreground">Open source code and contributions</p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-semibold flex items-center gap-2">
                      <SiDiscord size={16} className="text-primary" />
                      Discord
                    </h5>
                    <p className="text-sm text-muted-foreground">Community chat and instant support</p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-semibold flex items-center gap-2">
                      <SiTrustpilot size={16} className="text-primary" />
                      Trustpilot
                    </h5>
                    <p className="text-sm text-muted-foreground">Customer Reviews and Feedback</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-start gap-3 rounded-md border border-border bg-muted/30 p-3">
                    <div className="shrink-0">
                      <AlertTriangle size={18} className="text-amber-500" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Note:</strong> We do not handle billing or account related support via Discord. For privacy and security and to comply with Discord's policies please contact our support team at
                      {' '}
                      <a href="mailto:support@nodebyte.host" className="text-primary hover:underline">support@nodebyte.host</a>
                      {' '}or use our official support channels.
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
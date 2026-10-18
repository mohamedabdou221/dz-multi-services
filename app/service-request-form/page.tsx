'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ServiceRequestForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    forMyself: true,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    recipientFirstName: '',
    recipientLastName: '',
    recipientPhone: '',
    serviceType: '',
    preferredDate: '',
    description: '',
    additionalInfo: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    // TODO: Submit to Supabase
    const reference = `SRV-${Date.now().toString().slice(-6)}`
    router.push(`/request-confirmation?reference=${reference}`)
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-8 text-center">
          Demande de service
        </h1>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">Étape {step} sur 4</span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Pour qui */}
        {step === 1 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
              Pour qui est cette demande ?
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="forMyself"
                  checked={formData.forMyself}
                  onChange={() => setFormData(prev => ({ ...prev, forMyself: true }))}
                  className="w-4 h-4"
                />
                <span className="text-foreground">Pour moi-même</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="forMyself"
                  checked={!formData.forMyself}
                  onChange={() => setFormData(prev => ({ ...prev, forMyself: false }))}
                  className="w-4 h-4"
                />
                <span className="text-foreground">Pour quelqu'un d'autre</span>
              </label>

              {!formData.forMyself && (
                <div className="space-y-4 mt-4 p-4 bg-background rounded-lg">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">
                      Prénom du destinataire
                    </label>
                    <input
                      type="text"
                      name="recipientFirstName"
                      value={formData.recipientFirstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">
                      Nom du destinataire
                    </label>
                    <input
                      type="text"
                      name="recipientLastName"
                      value={formData.recipientLastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">
                      Téléphone du destinataire
                    </label>
                    <input
                      type="tel"
                      name="recipientPhone"
                      value={formData.recipientPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Coordonnées */}
        {step === 2 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
              Vos coordonnées
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Détails du service */}
        {step === 3 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
              Détails du service
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Type de service
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                >
                  <option value="">Sélectionnez un service</option>
                  <option value="photography">Photographie</option>
                  <option value="advertising">Publicité</option>
                  <option value="printing">Imprimerie</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Date souhaitée
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Informations supplémentaires */}
        {step === 4 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
              Informations supplémentaires
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Informations additionnelles
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                  placeholder="Toute information supplémentaire que vous souhaitez nous communiquer..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              onClick={handlePrevious}
              className="px-6 py-2 border border-border rounded-lg hover:bg-background transition-colors"
            >
              Précédent
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors ml-auto"
            >
              Suivant
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors ml-auto"
            >
              Envoyer la demande
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

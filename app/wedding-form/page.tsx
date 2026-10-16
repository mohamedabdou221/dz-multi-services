'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function WeddingFormPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Pour qui
    isForMe: false,
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    beneficiaryName: '',
    beneficiaryPhone: '',

    // Step 2: Date et lieu
    weddingDate: '',
    location: '',
    address: '',

    // Step 3: Type de mariage
    weddingType: '',

    // Step 4: Prestations
    services: [] as string[],
    customServices: '',

    // Step 5: Planning
    startTime: '',
    endTime: '',

    // Step 6: Invités
    guestCount: 0,

    // Step 7: Fichiers
    files: [] as File[],

    // Step 8: Notes
    notes: '',

    // Step 9: Confirmation
    confirmed: false,
  })

  const steps = [
    { id: 1, title: 'Pour qui' },
    { id: 2, title: 'Date et lieu' },
    { id: 3, title: 'Type de mariage' },
    { id: 4, title: 'Prestations' },
    { id: 5, title: 'Planning' },
    { id: 6, title: 'Invités' },
    { id: 7, title: 'Fichiers' },
    { id: 8, title: 'Notes' },
    { id: 9, title: 'Confirmation' },
  ]

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual submission
    console.log('Form submitted:', formData)
    // Generate a reference
    const reference = `REQ-${Date.now().toString().slice(-6)}`
    // Redirect to confirmation page
    router.push(`/request-confirmation?reference=${encodeURIComponent(reference)}`)
  }

  return (
    <div className="container mx-auto px-4 sm:px-16 py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          ← Retour aux services
        </Link>

        <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
          Formulaire de mariage
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Remplissez ce formulaire pour votre demande de service de mariage
        </p>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`text-sm ${
                  step.id === currentStep
                    ? 'text-primary font-semibold'
                    : step.id < currentStep
                    ? 'text-muted-foreground'
                    : 'text-muted-foreground/50'
                }`}
              >
                {step.id}
              </div>
            ))}
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`text-xs ${
                  step.id === currentStep
                    ? 'text-primary'
                    : step.id < currentStep
                    ? 'text-muted-foreground'
                    : 'text-muted-foreground/50'
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-semibold text-foreground">
                Pour qui ?
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    id="forme"
                    name="forWhom"
                    value="forme"
                    checked={!formData.isForMe}
                    onChange={() => setFormData({ ...formData, isForMe: false })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="forme" className="text-foreground">
                    Pour moi-même
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    id="autrui"
                    name="forWhom"
                    value="autrui"
                    checked={formData.isForMe}
                    onChange={() => setFormData({ ...formData, isForMe: true })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="autrui" className="text-foreground">
                    Pour quelqu'un d'autre
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="clientName" className="block text-sm font-medium text-foreground mb-2">
                    Votre nom complet
                  </label>
                  <input
                    id="clientName"
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
                  />
                </div>
                <div>
                  <label htmlFor="clientEmail" className="block text-sm font-medium text-foreground mb-2">
                    Votre e-mail
                  </label>
                  <input
                    id="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
                  />
                </div>
                <div>
                  <label htmlFor="clientPhone" className="block text-sm font-medium text-foreground mb-2">
                    Votre téléphone
                  </label>
                  <input
                    id="clientPhone"
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
                  />
                </div>
              </div>

              {formData.isForMe && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="beneficiaryName" className="block text-sm font-medium text-foreground mb-2">
                      Nom du bénéficiaire
                    </label>
                    <input
                      id="beneficiaryName"
                      type="text"
                      value={formData.beneficiaryName}
                      onChange={(e) => setFormData({ ...formData, beneficiaryName: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label htmlFor="beneficiaryPhone" className="block text-sm font-medium text-foreground mb-2">
                      Téléphone du bénéficiaire
                    </label>
                    <input
                      id="beneficiaryPhone"
                      type="tel"
                      value={formData.beneficiaryPhone}
                      onChange={(e) => setFormData({ ...formData, beneficiaryPhone: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-semibold text-foreground">
                Date et lieu
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="weddingDate" className="block text-sm font-medium text-foreground mb-2">
                    Date du mariage
                  </label>
                  <input
                    id="weddingDate"
                    type="date"
                    value={formData.weddingDate}
                    onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
                    Lieu
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
                    placeholder="Ex: Salle des fêtes de Moroni"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
                    Adresse complète
                  </label>
                  <textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-semibold text-foreground">
                Type de mariage
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    id="civil"
                    name="weddingType"
                    value="civil"
                    checked={formData.weddingType === 'civil'}
                    onChange={(e) => setFormData({ ...formData, weddingType: e.target.value })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="civil" className="text-foreground">
                    Mariage civil
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    id="religieux"
                    name="weddingType"
                    value="religieux"
                    checked={formData.weddingType === 'religieux'}
                    onChange={(e) => setFormData({ ...formData, weddingType: e.target.value })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="religieux" className="text-foreground">
                    Mariage religieux
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    id="mixte"
                    name="weddingType"
                    value="mixte"
                    checked={formData.weddingType === 'mixte'}
                    onChange={(e) => setFormData({ ...formData, weddingType: e.target.value })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="mixte" className="text-foreground">
                    Mariage mixte (civil + religieux)
                  </label>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-semibold text-foreground">
                Prestations
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Services souhaités
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        id="photo"
                        checked={formData.services.includes('photo')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, services: [...formData.services, 'photo'] })
                          } else {
                            setFormData({ ...formData, services: formData.services.filter(s => s !== 'photo') })
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <label htmlFor="photo" className="text-foreground">
                        Photographie
                      </label>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        id="video"
                        checked={formData.services.includes('video')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, services: [...formData.services, 'video'] })
                          } else {
                            setFormData({ ...formData, services: formData.services.filter(s => s !== 'video') })
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <label htmlFor="video" className="text-foreground">
                        Vidéo
                      </label>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        id="deco"
                        checked={formData.services.includes('deco')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, services: [...formData.services, 'deco'] })
                          } else {
                            setFormData({ ...formData, services: formData.services.filter(s => s !== 'deco') })
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <label htmlFor="deco" className="text-foreground">
                        Décoration
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="customServices" className="block text-sm font-medium text-foreground mb-2">
                    Autres prestations (optionnel)
                  </label>
                  <textarea
                    id="customServices"
                    value={formData.customServices}
                    onChange={(e) => setFormData({ ...formData, customServices: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground resize-none"
                    placeholder="Décrivez vos besoins spécifiques..."
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-semibold text-foreground">
                Planning
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-foreground mb-2">
                    Heure de début
                  </label>
                  <input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-foreground mb-2">
                    Heure de fin
                  </label>
                  <input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-semibold text-foreground">
                Invités
              </h2>
              <div>
                <label htmlFor="guestCount" className="block text-sm font-medium text-foreground mb-2">
                  Nombre d'invités prévus
                </label>
                <input
                  id="guestCount"
                  type="number"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) || 0 })}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
                />
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-semibold text-foreground">
                Fichiers
              </h2>
              <div>
                <label htmlFor="files" className="block text-sm font-medium text-foreground mb-2">
                  Téléverser des fichiers (optionnel)
                </label>
                <input
                  id="files"
                  type="file"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      setFormData({ ...formData, files: Array.from(e.target.files) })
                    }
                  }}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Formats acceptés: JPG, PNG, PDF (max 10MB par fichier)
                </p>
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-semibold text-foreground">
                Notes additionnelles
              </h2>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-2">
                  Vos notes ou commentaires (optionnel)
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground resize-none"
                  placeholder="Toute information supplémentaire qui pourrait nous aider..."
                />
              </div>
            </div>
          )}

          {currentStep === 9 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-semibold text-foreground">
                Confirmation
              </h2>
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">Récapitulatif</h3>
                  <p className="text-sm text-muted-foreground">
                    Veuillez vérifier vos informations avant de soumettre.
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Client:</strong> {formData.clientName}</p>
                  <p><strong>Email:</strong> {formData.clientEmail}</p>
                  <p><strong>Téléphone:</strong> {formData.clientPhone}</p>
                  {formData.isForMe && (
                    <>
                      <p><strong>Bénéficiaire:</strong> {formData.beneficiaryName}</p>
                      <p><strong>Téléphone bénéficiaire:</strong> {formData.beneficiaryPhone}</p>
                    </>
                  )}
                  <p><strong>Date:</strong> {formData.weddingDate}</p>
                  <p><strong>Lieu:</strong> {formData.location}</p>
                  <p><strong>Type:</strong> {formData.weddingType}</p>
                  <p><strong>Services:</strong> {formData.services.join(', ')}</p>
                  <p><strong>Invités:</strong> {formData.guestCount}</p>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    id="confirmed"
                    checked={formData.confirmed}
                    onChange={(e) => setFormData({ ...formData, confirmed: e.target.checked })}
                    required
                    className="w-4 h-4"
                  />
                  <label htmlFor="confirmed" className="text-sm text-foreground">
                    Je confirme que les informations ci-dessus sont correctes
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-6 border-t border-border">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
              >
                Suivant
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
              >
                Soumettre la demande
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

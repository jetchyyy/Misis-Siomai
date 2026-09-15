import React from 'react';
import { Plus, Save, Trash2, Loader2, Upload } from 'lucide-react';

export default function AdminSocialsTab({
  cmsSocials,
  setCmsSocials,
  handleSaveSocials,
  handleEventImageUpload,
  handleRemoveEventImage,
  uploadingIdx
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-zinc-900 dark:text-white">Socials & Charity Events CMS</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Manage community outreach events, charity drives, photos, and stories</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const newEvent = {
                id: `event-${Date.now()}`,
                title: 'New Community Outreach Drive',
                category: 'Community Outreach',
                date: 'Upcoming Initiative',
                location: 'Cebu City',
                impact: 'Community Support',
                image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
                description: 'Description of the charity drive or community outreach event...',
                highlights: ['Fresh food distribution', 'Volunteer effort'],
                quote: '"Giving back to our community with pure heart."'
              };
              setCmsSocials(prev => ({ ...prev, events: [newEvent, ...(prev.events || [])] }));
            }}
            className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer border border-gray-300 dark:border-zinc-700"
          >
            <Plus className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>Add Charity Event</span>
          </button>
          <button
            onClick={handleSaveSocials}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Socials CMS</span>
          </button>
        </div>
      </div>

      {/* Section Header Editor */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-4">
        <h3 className="font-heading font-bold text-lg text-zinc-900 dark:text-white">Socials Section Overview Text</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Section Headline Title</label>
            <input
              type="text"
              value={cmsSocials.title || ''}
              onChange={(e) => setCmsSocials(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white outline-none focus:border-rose-500 font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Section Subtitle / Narrative</label>
            <textarea
              rows={2}
              value={cmsSocials.description || ''}
              onChange={(e) => setCmsSocials(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:border-rose-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        <h3 className="font-heading font-bold text-xl text-zinc-900 dark:text-white">Community & Charity Event Stories ({(cmsSocials.events || []).length})</h3>
        
        {(cmsSocials.events || []).map((evt, idx) => (
          <div key={evt.id || idx} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-5 relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-zinc-800">
              <span className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Event #{idx + 1} · {evt.category || 'Outreach'}
              </span>
              <button
                onClick={() => {
                  const updated = cmsSocials.events.filter((_, i) => i !== idx);
                  setCmsSocials(prev => ({ ...prev, events: updated }));
                }}
                className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-red-800/40"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Event</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Event Photo & Image Control */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Event Photos Gallery ({Array.isArray(evt.images) && evt.images.length > 0 ? evt.images.length : (evt.image ? 1 : 0)})
                  </label>
                </div>

                {/* Main Cover Preview */}
                <div className="h-44 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 overflow-hidden relative group flex items-center justify-center">
                  <img 
                    src={evt.image || (Array.isArray(evt.images) && evt.images[0]) || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800'} 
                    alt={evt.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-[10px] font-bold text-amber-600 dark:text-amber-300 backdrop-blur-sm">
                    Main Cover Photo
                  </div>
                </div>

                {/* Gallery Thumbnails List */}
                {Array.isArray(evt.images) && evt.images.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Uploaded Photos:</span>
                    <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto pr-1">
                      {evt.images.map((imgUrl, imgIdx) => (
                        <div key={imgIdx} className="relative aspect-square rounded-lg bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 overflow-hidden group">
                          <img 
                            src={imgUrl} 
                            alt={`Photo ${imgIdx + 1}`} 
                            className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform" 
                            onClick={() => setFullScreenImage && setFullScreenImage(imgUrl)}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveEventImage(idx, imgIdx)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600/90 text-zinc-900 dark:text-white flex items-center justify-center hover:bg-red-700 transition-colors shadow"
                            title="Remove photo"
                          >
                            &times;
                          </button>
                          {imgIdx === 0 && (
                            <div className="absolute bottom-0 inset-x-0 bg-amber-500/80 text-[8px] font-bold text-black text-center py-0.5">
                              Cover
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <input
                    type="text"
                    placeholder="Main Image URL..."
                    value={evt.image || ''}
                    onChange={(e) => {
                      const updated = [...cmsSocials.events];
                      updated[idx].image = e.target.value;
                      setCmsSocials(prev => ({ ...prev, events: updated }));
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-amber-600 dark:text-amber-300 outline-none focus:border-rose-500 font-mono"
                  />
                  <label className={`w-full py-2.5 px-3 rounded-xl text-zinc-800 dark:text-zinc-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors border ${uploadingIdx === `event-${idx}` ? 'bg-zinc-700 border-zinc-600 opacity-60 cursor-not-allowed' : 'bg-rose-950/40 hover:bg-rose-900/60 border-rose-800/60 text-rose-200'}`}>
                    {uploadingIdx === `event-${idx}` ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600 dark:text-rose-400" /><span>Compressing & Uploading WebP...</span></>
                    ) : (
                      <><Upload className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /><span>Upload Multiple Event Photos</span></>
                    )}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingIdx === `event-${idx}`}
                      onChange={(e) => e.target.files?.length && handleEventImageUpload(idx, e.target.files)}
                    />
                  </label>
                  <p className="text-[10px] text-zinc-500 text-center">
                    Select one or multiple photos. Automatically converted to WebP (~100KB).
                  </p>
                </div>
              </div>

              {/* Event Details Form */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Event Title</label>
                    <input
                      type="text"
                      value={evt.title || ''}
                      onChange={(e) => {
                        const updated = [...cmsSocials.events];
                        updated[idx].title = e.target.value;
                        setCmsSocials(prev => ({ ...prev, events: updated }));
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:border-rose-500 font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Category Tag</label>
                    <input
                      type="text"
                      value={evt.category || ''}
                      onChange={(e) => {
                        const updated = [...cmsSocials.events];
                        updated[idx].category = e.target.value;
                        setCmsSocials(prev => ({ ...prev, events: updated }));
                      }}
                      placeholder="e.g. Feeding Program / Youth & Education"
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:border-rose-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Location</label>
                    <input
                      type="text"
                      value={evt.location || ''}
                      onChange={(e) => {
                        const updated = [...cmsSocials.events];
                        updated[idx].location = e.target.value;
                        setCmsSocials(prev => ({ ...prev, events: updated }));
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:border-rose-500 font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Date / Initiative Type</label>
                    <input
                      type="text"
                      value={evt.date || ''}
                      onChange={(e) => {
                        const updated = [...cmsSocials.events];
                        updated[idx].date = e.target.value;
                        setCmsSocials(prev => ({ ...prev, events: updated }));
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:border-rose-500 font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Impact Badge Label</label>
                    <input
                      type="text"
                      value={evt.impact || ''}
                      onChange={(e) => {
                        const updated = [...cmsSocials.events];
                        updated[idx].impact = e.target.value;
                        setCmsSocials(prev => ({ ...prev, events: updated }));
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-amber-600 dark:text-amber-300 focus:border-rose-500 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Full Event Story Description</label>
                  <textarea
                    rows={3}
                    value={evt.description || ''}
                    onChange={(e) => {
                      const updated = [...cmsSocials.events];
                      updated[idx].description = e.target.value;
                      setCmsSocials(prev => ({ ...prev, events: updated }));
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 focus:border-rose-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Key Highlights (comma separated)</label>
                    <input
                      type="text"
                      value={(evt.highlights || []).join(', ')}
                      onChange={(e) => {
                        const updated = [...cmsSocials.events];
                        updated[idx].highlights = e.target.value.split(',').map(s => s.trim());
                        setCmsSocials(prev => ({ ...prev, events: updated }));
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:border-rose-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Inspirational Quote</label>
                    <input
                      type="text"
                      value={evt.quote || ''}
                      onChange={(e) => {
                        const updated = [...cmsSocials.events];
                        updated[idx].quote = e.target.value;
                        setCmsSocials(prev => ({ ...prev, events: updated }));
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-emerald-600 dark:text-emerald-300 italic focus:border-rose-500"
                    />
                  </div>
                </div>

              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

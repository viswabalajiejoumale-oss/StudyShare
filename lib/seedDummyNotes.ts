
const sampleFiles = [
  { url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", type: "pdf" },
  { url: "https://file-examples.com/wp-content/uploads/2017/08/file_example_PPT_500kB.ppt", type: "ppt" },
  { url: "https://file-examples.com/wp-content/uploads/2017/02/file-sample_100kB.doc", type: "docs" },
  { url: "https://via.placeholder.com/800x600.png", type: "jpg" },
];

const dummySubjects = ["Mathematics","Physics","Chemistry","Biology","History","Economics","Computer Science","Philosophy","Sociology","Languages","Engineering","Medicine","Law","Arts","Business"];

export const seedDummyNotes = async () => {
  // Check count by calling backend
  try {
    const res = await fetch('/api/notes');
    const json = await res.json();
    const notesData = json.data || [];
    if (notesData.length >= 15) {
      console.log('At least 15 notes exist, skipping seed.');
      return;
    }
    const toCreate = 15 - notesData.length;
    // rebuild inserts using toCreate
    const newInserts: any[] = [];
    for (let i = 0; i < toCreate; i++) {
      const file = sampleFiles[i % sampleFiles.length];
      const subject = dummySubjects[i % dummySubjects.length];
      const authorId = `seed-user-${i}`;
      newInserts.push({
        user: authorId,
        title: `Sample Notes #${i + 1} - ${subject}`,
        description: `Automatically seeded sample ${file.type} file for preview and download`,
        subject,
        course: null,
        fileUrl: file.url,
        fileType: file.type,
        fileName: `sample-${i + 1}.${file.type}`,
        googleDriveId: null,
        thumbnailUrl: null,
        is_approved: true,
        is_flagged: false,
        download_count: Math.floor(Math.random() * 500),
      });
    }
    if (newInserts.length > 0) {
      await fetch('/api/_seed/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ notes: newInserts }) });
      console.log('Seeded dummy notes');
    }
    return;
  } catch (err) {
    console.error('Error checking notes', err);
  }
};

// Allow script to be run directly with `node` (after building if using TS)
if (require.main === module) {
  seedDummyNotes().catch(err => console.error(err));
}

# DESC: Cursor project hooks — doc-sync gate on git commit + /pr-review nudge on git push
pack_cursor_hooks() {
  hook_json hooks.json
  hook_script doc-sync-guard.sh
  hook_script review-nudge.sh
}

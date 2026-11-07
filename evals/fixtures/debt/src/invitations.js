export async function invite(queue, request) {
  await queue.send({ email: request.email, workspace: request.workspace });
}
export async function retryInvite(queue, request) {
  return invite(queue, request);
}

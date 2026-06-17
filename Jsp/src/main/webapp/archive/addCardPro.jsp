<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.oreilly.servlet.MultipartRequest" %>
<%@ page import="com.oreilly.servlet.multipart.DefaultFileRenamePolicy" %>
<%@ page import="archive.ArchiveDAO" %>
<%@ page import="archive.ArchiveVO" %>
<%@ page import="java.io.File" %>

<%
    response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
        response.setStatus(HttpServletResponse.SC_OK);
        return;
    }

    request.setCharacterEncoding("UTF-8");
    response.setContentType("application/json");

    String uploadPath = request.getServletContext().getRealPath("/upload");
    File dir = new File(uploadPath);
    if (!dir.exists()) dir.mkdirs();

    int maxSize = 1024 * 1024 * 10;

    try {
        MultipartRequest multi = new MultipartRequest(request, uploadPath, maxSize, "UTF-8", new DefaultFileRenamePolicy());

        String aname = multi.getParameter("aname");
        String uidStr = multi.getParameter("uid");
        int uid = Integer.parseInt(uidStr);

        String aimg_path = null;
        if (multi.getFilesystemName("aimg") != null) {
            aimg_path = "/upload/" + multi.getFilesystemName("aimg");
        }

        ArchiveVO av = new ArchiveVO();
        av.setUid(uid);
        av.setAname(aname);
        av.setAimgPath(aimg_path);

        ArchiveDAO adao = ArchiveDAO.getInstance();

        int aid = adao.createArchive(av);

        if (aid > 0) {
            int permissionId = adao.createDefaultPermission(aid);
            if (permissionId > 0) {
                int mappingResult = adao.createMemberPermissionMapping(uid, aid, permissionId);
                if (mappingResult > 0) {
                    out.print("{\"message\": \"success\"}");
                } else {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    out.print("{\"message\": \"error\", \"detail\": \"권한 매핑 실패\"}");
                }
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"message\": \"error\", \"detail\": \"권한 생성 실패\"}");
            }
        } else {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"message\": \"error\", \"detail\": \"DB 저장 실패\"}");
        }

    } catch(Exception e) {
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        out.print("{\"message\": \"error\", \"detail\": \"파일 업로드 또는 처리 중 오류가 발생했습니다.\"}");
    }
%>
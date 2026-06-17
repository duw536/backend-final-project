<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="archive.InvitationDAO" %>
<%@ page import="archive.InvitationVO" %>
<%@ page import="java.util.List" %>
<%
    response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setContentType("application/json");

    if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
        response.setStatus(HttpServletResponse.SC_OK);
        return;
    }

    request.setCharacterEncoding("UTF-8");

    String uidStr = request.getParameter("uid");
    if (uidStr == null || uidStr.equals("null")) {
        out.print("[]");
        return;
    }

    int uid = Integer.parseInt(uidStr);
    List<InvitationVO> list = InvitationDAO.getInstance().getInvitationList(uid);

    StringBuilder sb = new StringBuilder("[");
    for (int i = 0; i < list.size(); i++) {
        InvitationVO v = list.get(i);
        if (i > 0) sb.append(",");
        sb.append("{")
          .append("\"invitationId\":").append(v.getInvitationId()).append(",")
          .append("\"aid\":").append(v.getAid()).append(",")
          .append("\"aname\":\"").append(v.getAname()).append("\",")
          .append("\"inviterName\":\"").append(v.getInviterName()).append("\",")
          .append("\"createdTime\":\"").append(v.getCreatedTime()).append("\"")
          .append("}");
    }
    sb.append("]");
    out.print(sb.toString());
%>